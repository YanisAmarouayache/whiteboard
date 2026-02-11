package model

type Widget struct {
	ID      string                 `json:"id"`
	BoardID string                 `json:"boardId"`
	Type    string                 `json:"type"`
	Config  map[string]interface{} `json:"config"`
}
