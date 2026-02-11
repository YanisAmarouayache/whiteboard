export interface WsMessage<T = unknown> {
  type: 'presence' | 'board_update' | 'cursor' | 'ping';
  boardId: string;
  userId?: string;
  payload: T;
  timestamp: string;
}
