import { Injectable } from '@angular/core';
import { BoardStateService } from '../board/board-state.service';
import { WebsocketService } from './websocket.service';

@Injectable({ providedIn: 'root' })
export class RealtimeSyncService {
  constructor(
    private readonly boardState: BoardStateService,
    private readonly socket: WebsocketService
  ) {}

  start(boardId: string): void {
    this.socket.connect(boardId).subscribe((message) => {
      if (message.type !== 'board_update') return;
      this.boardState.update((state) => ({ ...state, widgets: (message.payload as any).widgets ?? state.widgets }));
    });
  }
}
