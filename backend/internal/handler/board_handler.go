package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/yourusername/miro-clone-backend/internal/service"
)

type BoardHandler struct {
	boards *service.BoardService
}

func NewBoardHandler(boards *service.BoardService) *BoardHandler {
	return &BoardHandler{boards: boards}
}

func (h *BoardHandler) GetBoard(c *gin.Context) {
	userID := c.GetString("userID")
	board, err := h.boards.GetBoard(c.Request.Context(), c.Param("id"), userID)
	if err != nil {
		writeBoardServiceError(c, err, http.StatusNotFound)
		return
	}
	c.JSON(http.StatusOK, board)
}

func (h *BoardHandler) CreateBoard(c *gin.Context) {
	var body createBoardRequest
	if err := c.ShouldBindJSON(&body); err != nil {
		writeError(c, http.StatusBadRequest, err)
		return
	}
	userID := c.GetString("userID")
	board, err := h.boards.CreateBoard(c.Request.Context(), body.Name, body.WorkspaceID, userID)
	if err != nil {
		writeBoardServiceError(c, err, http.StatusInternalServerError)
		return
	}
	c.JSON(http.StatusCreated, board)
}

func (h *BoardHandler) UpdateBoard(c *gin.Context) {
	var req updateBoardRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		writeError(c, http.StatusBadRequest, err)
		return
	}
	userID := c.GetString("userID")
	err := h.boards.UpdateBoard(c.Request.Context(), c.Param("id"), userID, req.Widgets, req.Version)
	if err != nil {
		writeBoardServiceError(c, err, http.StatusInternalServerError)
		return
	}
	c.Status(http.StatusNoContent)
}

func (h *BoardHandler) DeleteBoard(c *gin.Context) {
	userID := c.GetString("userID")
	if err := h.boards.DeleteBoard(c.Request.Context(), c.Param("id"), userID); err != nil {
		writeBoardServiceError(c, err, http.StatusInternalServerError)
		return
	}
	c.Status(http.StatusNoContent)
}

func (h *BoardHandler) ListBoards(c *gin.Context) {
	userID := c.GetString("userID")
	boards, err := h.boards.ListBoards(c.Request.Context(), c.Param("workspaceID"), userID)
	if err != nil {
		writeBoardServiceError(c, err, http.StatusInternalServerError)
		return
	}
	c.JSON(http.StatusOK, boards)
}
