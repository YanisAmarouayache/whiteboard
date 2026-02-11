package main

import (
	"log"

	"github.com/joho/godotenv"
	"github.com/yourusername/miro-clone-backend/config"
	"github.com/yourusername/miro-clone-backend/internal/handler"
	"github.com/yourusername/miro-clone-backend/internal/repository"
	"github.com/yourusername/miro-clone-backend/internal/router"
	"github.com/yourusername/miro-clone-backend/internal/service"
	"github.com/yourusername/miro-clone-backend/internal/ws"
	"github.com/yourusername/miro-clone-backend/pkg/database"
)

func main() {
	_ = godotenv.Load()
	cfg := config.Load()

	db, err := database.Connect(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("db connection failed: %v", err)
	}
	defer db.Close()

	boardRepo := repository.NewBoardRepository(db)
	userRepo := repository.NewUserRepository(db)
	workspaceRepo := repository.NewWorkspaceRepository(db)

	boardService := service.NewBoardService(boardRepo)
	authService := service.NewAuthService(userRepo, cfg.JWTSecret)
	bootstrapService := service.NewBootstrapService(userRepo, workspaceRepo, boardRepo)

	hub := ws.NewHub()
	go hub.Run()

	healthHandler := handler.NewHealthHandler()
	authHandler := handler.NewAuthHandler(authService)
	bootstrapHandler := handler.NewBootstrapHandler(bootstrapService)
	boardHandler := handler.NewBoardHandler(boardService)
	wsHandler := handler.NewWebsocketHandler(hub)

	r := router.New(router.Handlers{
		Health:    healthHandler,
		Auth:      authHandler,
		Bootstrap: bootstrapHandler,
		Board:     boardHandler,
		Websocket: wsHandler,
		JWTSecret: cfg.JWTSecret,
		CORS:      cfg.CORSOrigins,
	})

	log.Printf("server starting on :%s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatalf("server run failed: %v", err)
	}
}
