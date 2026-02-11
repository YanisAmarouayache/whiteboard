package model

import (
	"encoding/json"
	"time"
)

type Board struct {
	ID          string          `json:"id"`
	WorkspaceID string          `json:"workspaceId"`
	Name        string          `json:"name"`
	Version     int             `json:"version"`
	State       json.RawMessage `json:"state"`
	CreatedBy   string          `json:"createdBy"`
	CreatedAt   time.Time       `json:"createdAt"`
	UpdatedAt   time.Time       `json:"updatedAt"`
}

type UpdateBoardRequest struct {
	Widgets json.RawMessage `json:"widgets"`
	Version int             `json:"version"`
}
