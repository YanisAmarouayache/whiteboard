package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/yourusername/miro-clone-backend/internal/ws"
)

type WebsocketHandler struct {
	hub      *ws.Hub
	upgrader websocket.Upgrader
}

func NewWebsocketHandler(hub *ws.Hub) *WebsocketHandler {
	return &WebsocketHandler{
		hub: hub,
		upgrader: websocket.Upgrader{
			CheckOrigin: func(_ *http.Request) bool { return true },
		},
	}
}

func (h *WebsocketHandler) HandleConnection(c *gin.Context) {
	boardID := c.Query("boardId")
	if boardID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing boardId"})
		return
	}
	userID := c.GetString("userID")
	if userID == "" {
		userID = "anonymous"
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
