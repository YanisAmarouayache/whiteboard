package service

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/yourusername/miro-clone-backend/internal/model"
	"github.com/yourusername/miro-clone-backend/internal/repository"
	"github.com/yourusername/miro-clone-backend/pkg/util"
)

type AuthService struct {
	users     repository.UserRepository
	jwtSecret string
}

func NewAuthService(users repository.UserRepository, jwtSecret string) *AuthService {
	return &AuthService{users: users, jwtSecret: jwtSecret}
}

func (s *AuthService) Register(ctx context.Context, email, name, password string) (*model.User, error) {
	hash, err := util.HashPassword(password)
	if err != nil {
		return nil, err
	}
	user := &model.User{ID: uuid.NewString(), Email: email, Name: name, Password: hash}
	if err := s.users.Create(ctx, user); err != nil {
		return nil, err
	}
	return user, nil
}

func (s *AuthService) Login(ctx context.Context, email, password string) (string, error) {
	user, err := s.users.GetByEmail(ctx, email)
	if err != nil {
		return "", err
	}
	if !util.CheckPassword(password, user.Password) {
		return "", errors.New("invalid credentials")
	}
	return util.GenerateToken(user.ID, s.jwtSecret)
}
