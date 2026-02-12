package handler

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/yourusername/miro-clone-backend/internal/service"
)

func writeError(c *gin.Context, status int, err error) {
	c.JSON(status, gin.H{"error": err.Error()})
}

func writeBoardServiceError(c *gin.Context, err error, fallback int) {
	switch {
	case errors.Is(err, service.ErrForbidden):
		writeError(c, http.StatusForbidden, err)
	case errors.Is(err, service.ErrVersionConflict):
		writeError(c, http.StatusConflict, err)
	default:
		writeError(c, fallback, err)
	}
}
