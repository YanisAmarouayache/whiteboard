package service

import (
	"context"
	"encoding/json"
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/yourusername/miro-clone-backend/internal/model"
	"github.com/yourusername/miro-clone-backend/internal/repository"
)

var ErrVersionConflict = errors.New("version conflict")

type BoardService struct {
	repo repository.BoardRepository
}

func NewBoardService(repo repository.BoardRepository) *BoardService {
	return &BoardService{repo: repo}
}

func (s *BoardService) GetBoard(ctx context.Context, id string) (*model.Board, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *BoardService) CreateBoard(ctx context.Context, name, workspaceID, userID string) (*model.Board, error) {
	board := &model.Board{
		ID:          uuid.NewString(),
		WorkspaceID: workspaceID,
		Name:        name,
		Version:     1,
		State:       json.RawMessage(`{"widgets":[]}`),
		CreatedBy:   userID,
		CreatedAt:   time.Now().UTC(),
		UpdatedAt:   time.Now().UTC(),
	}
	if err := s.repo.Create(ctx, board); err != nil {
		return nil, err
	}
	return board, nil
}

func (s *BoardService) UpdateBoard(ctx context.Context, id string, widgets json.RawMessage, expectedVersion int) error {
	state, err := json.Marshal(map[string]json.RawMessage{
		"widgets": widgets,
	})
	if err != nil {
		return err
	}
	ok, err := s.repo.UpdateWithVersion(ctx, id, state, expectedVersion)
	if err != nil {
		return err
	}
	if !ok {
		return ErrVersionConflict
	}
	return nil
}

func (s *BoardService) DeleteBoard(ctx context.Context, id string) error {
	return s.repo.Delete(ctx, id)
}

func (s *BoardService) ListBoards(ctx context.Context, workspaceID string) ([]model.Board, error) {
	return s.repo.ListByWorkspace(ctx, workspaceID)
}
