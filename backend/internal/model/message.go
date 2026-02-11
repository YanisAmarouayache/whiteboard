package model

type Message struct {
	Type    string      `json:"type"`
	BoardID string      `json:"boardId"`
	UserID  string      `json:"userId"`
	Payload interface{} `json:"payload"`
}
