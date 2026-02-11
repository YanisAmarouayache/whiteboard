package ws

import (
	"time"

	"github.com/gorilla/websocket"
)

type Client struct {
	hub     *Hub
	conn    *websocket.Conn
	send    chan *Message
	boardID string
	userID  string
}

func NewClient(hub *Hub, conn *websocket.Conn, boardID, userID string) *Client {
	return &Client{hub: hub, conn: conn, send: make(chan *Message, 16), boardID: boardID, userID: userID}
}

func (c *Client) ReadPump() {
	defer func() {
		c.hub.unregister <- c
		_ = c.conn.Close()
	}()
	for {
		var msg Message
		if err := c.conn.ReadJSON(&msg); err != nil {
			break
		}
		msg.BoardID = c.boardID
		msg.UserID = c.userID
		c.hub.broadcast <- &msg
	}
}

func (c *Client) WritePump() {
	ticker := time.NewTicker(30 * time.Second)
	defer func() {
		ticker.Stop()
		_ = c.conn.Close()
	}()
	for {
		select {
		case msg, ok := <-c.send:
			if !ok {
				_ = c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}
			if err := c.conn.WriteJSON(msg); err != nil {
				return
			}
		case <-ticker.C:
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}
