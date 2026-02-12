package repository

import (
	"context"
	"database/sql"

	"github.com/yourusername/miro-clone-backend/internal/model"
	"github.com/yourusername/miro-clone-backend/internal/port"
)

type workspaceRepository struct {
	db *sql.DB
}

func NewWorkspaceRepository(db *sql.DB) port.WorkspaceRepository {
	return &workspaceRepository{db: db}
}

func (r *workspaceRepository) ListByUser(ctx context.Context, userID string) ([]model.Workspace, error) {
	query := `
		SELECT w.id::text, w.name, w.owner_id::text, w.created_at
		FROM workspaces w
		INNER JOIN workspace_members wm ON wm.workspace_id = w.id
		WHERE wm.user_id = $1::uuid
		ORDER BY w.created_at ASC
	`
	rows, err := r.db.QueryContext(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	workspaces := make([]model.Workspace, 0)
	for rows.Next() {
		var workspace model.Workspace
		if err := rows.Scan(&workspace.ID, &workspace.Name, &workspace.OwnerID, &workspace.CreatedAt); err != nil {
			return nil, err
		}
		workspaces = append(workspaces, workspace)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return workspaces, nil
}

func (r *workspaceRepository) Create(ctx context.Context, workspace *model.Workspace) error {
	query := `
		INSERT INTO workspaces (id, name, owner_id)
		VALUES ($1::uuid, $2, $3::uuid)
	`
	_, err := r.db.ExecContext(ctx, query, workspace.ID, workspace.Name, workspace.OwnerID)
	return err
}

func (r *workspaceRepository) AddMember(ctx context.Context, workspaceID, userID, role string) error {
	query := `
		INSERT INTO workspace_members (workspace_id, user_id, role)
		VALUES ($1::uuid, $2::uuid, $3)
		ON CONFLICT (workspace_id, user_id) DO NOTHING
	`
	_, err := r.db.ExecContext(ctx, query, workspaceID, userID, role)
	return err
}

func (r *workspaceRepository) IsMember(ctx context.Context, workspaceID, userID string) (bool, error) {
	query := `
		SELECT EXISTS (
			SELECT 1
			FROM workspace_members
			WHERE workspace_id = $1::uuid
			  AND user_id = $2::uuid
		)
	`
	var isMember bool
	if err := r.db.QueryRowContext(ctx, query, workspaceID, userID).Scan(&isMember); err != nil {
		return false, err
	}
	return isMember, nil
}
