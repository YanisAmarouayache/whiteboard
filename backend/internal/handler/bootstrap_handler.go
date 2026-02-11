package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/yourusername/miro-clone-backend/internal/service"
)

type BootstrapHandler struct {
	bootstrap *service.BootstrapService
}

func NewBootstrapHandler(bootstrap *service.BootstrapService) *BootstrapHandler {
	return &BootstrapHandler{bootstrap: bootstrap}
}

func (h *BootstrapHandler) Get(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "missing user context"})
		return
	}
	payload, err := h.bootstrap.Load(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, payload)
}
