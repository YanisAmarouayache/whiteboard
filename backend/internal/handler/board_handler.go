package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/yourusername/miro-clone-backend/internal/model"
	"github.com/yourusername/miro-clone-backend/internal/service"
)

type BoardHandler struct {
	boards *service.BoardService
}

func NewBoardHandler(boards *service.BoardService) *BoardHandler {
	return &BoardHandler{boards: boards}
}

func (h *BoardHandler) GetBoard(c *gin.Context) {
	board, err := h.boards.GetBoard(c.Request.Context(), c.Param("id"))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, board)
}

func (h *BoardHandler) CreateBoard(c *gin.Context) {
	var body struct {
		Name        string `json:"name"`
		WorkspaceID string `json:"workspaceId"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	userID := c.GetString("userID")
	board, err := h.boards.CreateBoard(c.Request.Context(), body.Name, body.WorkspaceID, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, board)
}

func (h *BoardHandler) UpdateBoard(c *gin.Context) {
	var req model.UpdateBoardRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	err := h.boards.UpdateBoard(c.Request.Context(), c.Param("id"), req.Widgets, req.Version)
	if err != nil {
		status := http.StatusInternalServerError
		if err == service.ErrVersionConflict {
			status = http.StatusConflict
		}
		c.JSON(status, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}

func (h *BoardHandler) DeleteBoard(c *gin.Context) {
	if err := h.boards.DeleteBoard(c.Request.Context(), c.Param("id")); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}

func (h *BoardHandler) ListBoards(c *gin.Context) {
	boards, err := h.boards.ListBoards(c.Request.Context(), c.Param("workspaceID"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, boards)
}
