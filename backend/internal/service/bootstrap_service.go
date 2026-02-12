package service

import (
	"context"
	"encoding/json"

	"github.com/google/uuid"
	"github.com/yourusername/miro-clone-backend/internal/model"
	"github.com/yourusername/miro-clone-backend/internal/port"
)

type BootstrapService struct {
	users      port.UserRepository
	workspaces port.WorkspaceRepository
	boards     port.BoardRepository
}

type BootstrapPayload struct {
	User      *model.User     `json:"user"`
	Workspace model.Workspace `json:"workspace"`
	Board     *model.Board    `json:"board"`
	Boards    []model.Board   `json:"boards"`
}

func NewBootstrapService(
	users port.UserRepository,
	workspaces port.WorkspaceRepository,
	boards port.BoardRepository,
) *BootstrapService {
	return &BootstrapService{users: users, workspaces: workspaces, boards: boards}
}

func (s *BootstrapService) Load(ctx context.Context, userID string) (*BootstrapPayload, error) {
	user, err := s.users.GetByID(ctx, userID)
	if err != nil {
		return nil, err
	}

	workspace, err := s.ensureWorkspace(ctx, userID)
	if err != nil {
		return nil, err
	}

	boards, err := s.boards.ListByWorkspace(ctx, workspace.ID)
	if err != nil {
		return nil, err
	}

	if len(boards) == 0 {
		state := json.RawMessage(`{"widgets":[]}`)
		board := &model.Board{
			ID:          uuid.NewString(),
			WorkspaceID: workspace.ID,
			Name:        "Untitled Board",
			Version:     1,
			State:       state,
			CreatedBy:   userID,
		}
		if err := s.boards.Create(ctx, board); err != nil {
			return nil, err
		}
		boards = append(boards, *board)
	}

	board := boards[0]
	return &BootstrapPayload{
		User:      user,
		Workspace: workspace,
		Board:     &board,
		Boards:    boards,
	}, nil
}

func (s *BootstrapService) ensureWorkspace(ctx context.Context, userID string) (model.Workspace, error) {
	workspaces, err := s.workspaces.ListByUser(ctx, userID)
	if err != nil {
		return model.Workspace{}, err
	}
	if len(workspaces) > 0 {
		return workspaces[0], nil
	}
	workspace := model.Workspace{
		ID:      uuid.NewString(),
		Name:    "Default Workspace",
		OwnerID: userID,
	}
	if err := s.workspaces.Create(ctx, &workspace); err != nil {
		return model.Workspace{}, err
	}
	if err := s.workspaces.AddMember(ctx, workspace.ID, userID, "owner"); err != nil {
		return model.Workspace{}, err
	}
	return workspace, nil
}
