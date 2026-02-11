package middleware

import (
	"strings"

	"github.com/gin-gonic/gin"
)

func CORS(origins string) gin.HandlerFunc {
	allowed := strings.Split(origins, ",")
	return func(c *gin.Context) {
		origin := c.GetHeader("Origin")
		for _, allowedOrigin := range allowed {
			if strings.TrimSpace(allowedOrigin) == origin {
				c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
				break
			}
		}
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Authorization, Content-Type")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	}
}
