package repository

import (
	"context"
	"database/sql"

	"github.com/yourusername/miro-clone-backend/internal/model"
	"github.com/yourusername/miro-clone-backend/internal/port"
)

type boardRepository struct {
	db *sql.DB
}

func NewBoardRepository(db *sql.DB) port.BoardRepository {
	return &boardRepository{db: db}
}

func (r *boardRepository) GetByID(ctx context.Context, id string) (*model.Board, error) {
	query := `
		SELECT id::text, workspace_id::text, name, version, state, created_by::text, created_at, updated_at
		FROM boards
		WHERE id = $1::uuid
	`
	var board model.Board
	if err := r.db.QueryRowContext(ctx, query, id).Scan(
		&board.ID,
		&board.WorkspaceID,
		&board.Name,
		&board.Version,
		&board.State,
		&board.CreatedBy,
		&board.CreatedAt,
		&board.UpdatedAt,
	); err != nil {
		return nil, err
	}
	return &board, nil
}

func (r *boardRepository) ListByWorkspace(ctx context.Context, workspaceID string) ([]model.Board, error) {
	query := `
		SELECT id::text, workspace_id::text, name, version, state, created_by::text, created_at, updated_at
		FROM boards
		WHERE workspace_id = $1::uuid
		ORDER BY created_at ASC
	`
	rows, err := r.db.QueryContext(ctx, query, workspaceID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	boards := make([]model.Board, 0)
	for rows.Next() {
		var board model.Board
		if err := rows.Scan(
			&board.ID,
			&board.WorkspaceID,
			&board.Name,
			&board.Version,
			&board.State,
			&board.CreatedBy,
			&board.CreatedAt,
			&board.UpdatedAt,
		); err != nil {
			return nil, err
		}
		boards = append(boards, board)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return boards, nil
}

func (r *boardRepository) Create(ctx context.Context, board *model.Board) error {
	query := `
		INSERT INTO boards (id, workspace_id, name, version, state, created_by)
		VALUES ($1::uuid, $2::uuid, $3, $4, $5::jsonb, $6::uuid)
	`
	_, err := r.db.ExecContext(ctx, query, board.ID, board.WorkspaceID, board.Name, board.Version, board.State, board.CreatedBy)
	return err
}

func (r *boardRepository) UpdateWithVersion(ctx context.Context, boardID string, state []byte, expectedVersion int) (bool, error) {
	query := `
		UPDATE boards
		SET state = $1::jsonb,
			version = version + 1,
			updated_at = NOW()
		WHERE id = $2::uuid
		  AND version = $3
	`
	res, err := r.db.ExecContext(ctx, query, state, boardID, expectedVersion)
	if err != nil {
		return false, err
	}
	affected, err := res.RowsAffected()
	if err != nil {
		return false, err
	}
	return affected == 1, nil
}

func (r *boardRepository) Delete(ctx context.Context, boardID string) error {
	_, err := r.db.ExecContext(ctx, `DELETE FROM boards WHERE id = $1::uuid`, boardID)
	return err
}

func (r *boardRepository) UserCanAccess(ctx context.Context, boardID, userID string) (bool, error) {
	query := `
		SELECT EXISTS (
			SELECT 1
			FROM boards b
			INNER JOIN workspace_members wm ON wm.workspace_id = b.workspace_id
			WHERE b.id = $1::uuid
			  AND wm.user_id = $2::uuid
		)
	`
	var canAccess bool
	if err := r.db.QueryRowContext(ctx, query, boardID, userID).Scan(&canAccess); err != nil {
		return false, err
	}
	return canAccess, nil
}
