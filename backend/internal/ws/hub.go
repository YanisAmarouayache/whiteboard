package ws

import "sync"

type Hub struct {
	boards     map[string]map[*Client]bool
	broadcast  chan *Message
	register   chan *Client
	unregister chan *Client
	mu         sync.RWMutex
}

func NewHub() *Hub {
	return &Hub{
		boards:     make(map[string]map[*Client]bool),
		broadcast:  make(chan *Message),
		register:   make(chan *Client),
		unregister: make(chan *Client),
	}
}

func (h *Hub) Register(client *Client) {
	h.register <- client
}

func (h *Hub) Unregister(client *Client) {
	h.unregister <- client
}

func (h *Hub) Broadcast(message *Message) {
	h.broadcast <- message
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			h.registerClient(client)
		case client := <-h.unregister:
			h.unregisterClient(client)
		case message := <-h.broadcast:
			h.broadcastToBoard(message)
		}
	}
}

func (h *Hub) registerClient(client *Client) {
	h.mu.Lock()
	defer h.mu.Unlock()
	if _, ok := h.boards[client.boardID]; !ok {
		h.boards[client.boardID] = make(map[*Client]bool)
	}
	h.boards[client.boardID][client] = true
}

func (h *Hub) unregisterClient(client *Client) {
	h.mu.Lock()
	defer h.mu.Unlock()
	if clients, ok := h.boards[client.boardID]; ok {
		delete(clients, client)
		close(client.send)
		if len(clients) == 0 {
			delete(h.boards, client.boardID)
		}
	}
}

func (h *Hub) broadcastToBoard(message *Message) {
	h.mu.RLock()
	clients := h.boards[message.BoardID]
	h.mu.RUnlock()
	for client := range clients {
		select {
		case client.send <- message:
		default:
			h.unregister <- client
		}
	}
}

func (h *Hub) GetBoardClientCount(boardID string) int {
	h.mu.RLock()
	defer h.mu.RUnlock()
	return len(h.boards[boardID])
}
