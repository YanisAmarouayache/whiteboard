package handler

import (
	"errors"
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
		writeError(c, http.StatusUnauthorized, errors.New("missing user context"))
		return
	}
	payload, err := h.bootstrap.Load(c.Request.Context(), userID)
	if err != nil {
		writeError(c, http.StatusInternalServerError, err)
		return
	}
	c.JSON(http.StatusOK, payload)
}
