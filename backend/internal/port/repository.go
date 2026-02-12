package port

import (
	"context"

	"github.com/yourusername/miro-clone-backend/internal/model"
)

type UserRepository interface {
	GetByEmail(ctx context.Context, email string) (*model.User, error)
	GetByID(ctx context.Context, id string) (*model.User, error)
	Create(ctx context.Context, user *model.User) error
}

type WorkspaceRepository interface {
	ListByUser(ctx context.Context, userID string) ([]model.Workspace, error)
	Create(ctx context.Context, workspace *model.Workspace) error
	AddMember(ctx context.Context, workspaceID, userID, role string) error
	IsMember(ctx context.Context, workspaceID, userID string) (bool, error)
}

type BoardRepository interface {
	GetByID(ctx context.Context, id string) (*model.Board, error)
	ListByWorkspace(ctx context.Context, workspaceID string) ([]model.Board, error)
	Create(ctx context.Context, board *model.Board) error
	UpdateWithVersion(ctx context.Context, boardID string, state []byte, expectedVersion int) (bool, error)
	Delete(ctx context.Context, boardID string) error
	UserCanAccess(ctx context.Context, boardID, userID string) (bool, error)
}
