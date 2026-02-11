package service

import (
	"context"

	"github.com/yourusername/miro-clone-backend/internal/model"
	"github.com/yourusername/miro-clone-backend/internal/repository"
)

type UserService struct {
	repo repository.UserRepository
}

func NewUserService(repo repository.UserRepository) *UserService {
	return &UserService{repo: repo}
}

func (s *UserService) GetByEmail(ctx context.Context, email string) (*model.User, error) {
	return s.repo.GetByEmail(ctx, email)
}
