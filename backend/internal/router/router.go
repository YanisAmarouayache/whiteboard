package router

import (
	"github.com/gin-gonic/gin"
	"github.com/yourusername/miro-clone-backend/internal/handler"
	"github.com/yourusername/miro-clone-backend/pkg/middleware"
)

type Handlers struct {
	Health    *handler.HealthHandler
	Auth      *handler.AuthHandler
	Bootstrap *handler.BootstrapHandler
	Board     *handler.BoardHandler
	Websocket *handler.WebsocketHandler
	JWTSecret string
	CORS      string
}

func New(h Handlers) *gin.Engine {
	r := gin.New()
	r.Use(middleware.Logger())
	r.Use(middleware.Recovery())
	r.Use(middleware.CORS(h.CORS))

	r.GET("/health", h.Health.Get)
	r.POST("/api/auth/register", h.Auth.Register)
	r.POST("/api/auth/login", h.Auth.Login)
	r.POST("/api/auth/refresh", h.Auth.Refresh)

	auth := middleware.AuthRequired(h.JWTSecret)
	api := r.Group("/api", auth)
	{
		api.GET("/bootstrap", h.Bootstrap.Get)
		api.GET("/boards/:id", h.Board.GetBoard)
		api.POST("/boards", h.Board.CreateBoard)
		api.PUT("/boards/:id", h.Board.UpdateBoard)
		api.DELETE("/boards/:id", h.Board.DeleteBoard)
		api.GET("/workspaces/:workspaceID/boards", h.Board.ListBoards)
	}

	r.GET("/ws", auth, h.Websocket.HandleConnection)
	return r
}
