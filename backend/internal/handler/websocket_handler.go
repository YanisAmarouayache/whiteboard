package handler

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/yourusername/miro-clone-backend/internal/service"
	"github.com/yourusername/miro-clone-backend/internal/ws"
)

type WebsocketHandler struct {
	hub            *ws.Hub
	boards         *service.BoardService
	allowedOrigins map[string]bool
	upgrader       websocket.Upgrader
}

func NewWebsocketHandler(hub *ws.Hub, boards *service.BoardService, corsOrigins string) *WebsocketHandler {
	h := &WebsocketHandler{
		hub:            hub,
		boards:         boards,
		allowedOrigins: toAllowedOrigins(corsOrigins),
	}
	h.upgrader = websocket.Upgrader{
		CheckOrigin: h.checkOrigin,
	}
	return h
}

func toAllowedOrigins(corsOrigins string) map[string]bool {
	out := make(map[string]bool)
	for _, origin := range strings.Split(corsOrigins, ",") {
		trimmed := strings.TrimSpace(origin)
		if trimmed != "" {
			out[trimmed] = true
		}
	}
	return out
}

func (h *WebsocketHandler) checkOrigin(r *http.Request) bool {
	origin := strings.TrimSpace(r.Header.Get("Origin"))
	if origin == "" {
		return true
	}
	if h.allowedOrigins["*"] {
		return true
	}
	return h.allowedOrigins[origin]
}

func (h *WebsocketHandler) HandleConnection(c *gin.Context) {
	boardID := c.Query("boardId")
	if boardID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing boardId"})
		return
	}
	userID := c.GetString("userID")
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "missing user"})
		return
	}
	canAccess, err := h.boards.CanAccessBoard(c.Request.Context(), boardID, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if !canAccess {
		c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
		return
	}

	conn, err := h.upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	client := ws.NewClient(h.hub, conn, boardID, userID)
	h.hub.Register(client)
	go client.WritePump()
	go client.ReadPump()
}
