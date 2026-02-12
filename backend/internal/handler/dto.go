package handler

import "encoding/json"

type createBoardRequest struct {
	Name        string `json:"name"`
	WorkspaceID string `json:"workspaceId"`
}

type updateBoardRequest struct {
	Widgets json.RawMessage `json:"widgets"`
	Version int             `json:"version"`
}

type registerRequest struct {
	Email    string `json:"email"`
	Name     string `json:"name"`
	Password string `json:"password"`
}

type loginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}
