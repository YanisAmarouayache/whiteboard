package service

import (
	"context"
	"encoding/json"
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/yourusername/miro-clone-backend/internal/model"
	"github.com/yourusername/miro-clone-backend/internal/port"
)

var ErrVersionConflict = errors.New("version conflict")
var ErrForbidden = errors.New("forbidden")

type BoardService struct {
	boards     port.BoardRepository
	workspaces port.WorkspaceRepository
}

func NewBoardService(
	boards port.BoardRepository,
	workspaces port.WorkspaceRepository,
) *BoardService {
	return &BoardService{
		boards:     boards,
		workspaces: workspaces,
	}
}

func (s *BoardService) GetBoard(ctx context.Context, id, userID string) (*model.Board, error) {
	canAccess, err := s.boards.UserCanAccess(ctx, id, userID)
	if err != nil {
		return nil, err
	}
	if !canAccess {
		return nil, ErrForbidden
	}
	return s.boards.GetByID(ctx, id)
}

func (s *BoardService) CreateBoard(ctx context.Context, name, workspaceID, userID string) (*model.Board, error) {
	isMember, err := s.workspaces.IsMember(ctx, workspaceID, userID)
	if err != nil {
		return nil, err
	}
	if !isMember {
		return nil, ErrForbidden
	}

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
	if err := s.boards.Create(ctx, board); err != nil {
		return nil, err
	}
	return board, nil
}

func (s *BoardService) UpdateBoard(
	ctx context.Context,
	id string,
	userID string,
	widgets json.RawMessage,
	expectedVersion int,
) error {
	canAccess, err := s.boards.UserCanAccess(ctx, id, userID)
	if err != nil {
		return err
	}
	if !canAccess {
		return ErrForbidden
	}

	state, err := json.Marshal(map[string]json.RawMessage{
		"widgets": widgets,
	})
	if err != nil {
		return err
	}
	ok, err := s.boards.UpdateWithVersion(ctx, id, state, expectedVersion)
	if err != nil {
		return err
	}
	if !ok {
		return ErrVersionConflict
	}
	return nil
}

func (s *BoardService) DeleteBoard(ctx context.Context, id, userID string) error {
	canAccess, err := s.boards.UserCanAccess(ctx, id, userID)
	if err != nil {
		return err
	}
	if !canAccess {
		return ErrForbidden
	}
	return s.boards.Delete(ctx, id)
}

func (s *BoardService) ListBoards(ctx context.Context, workspaceID, userID string) ([]model.Board, error) {
	isMember, err := s.workspaces.IsMember(ctx, workspaceID, userID)
	if err != nil {
		return nil, err
	}
	if !isMember {
		return nil, ErrForbidden
	}
	return s.boards.ListByWorkspace(ctx, workspaceID)
}

func (s *BoardService) CanAccessBoard(ctx context.Context, boardID, userID string) (bool, error) {
	return s.boards.UserCanAccess(ctx, boardID, userID)
}
