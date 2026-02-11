import { Injectable } from '@angular/core';
import { Observable, Subject, timer } from 'rxjs';
import { environment } from '../../environments/environment';
import { WsMessage } from './models/ws-message';

@Injectable({ providedIn: 'root' })
export class WebsocketService {
  private socket?: WebSocket;
  private readonly message$ = new Subject<WsMessage>();

  connect(boardId: string): Observable<WsMessage> {
    const token = localStorage.getItem('auth_token');
    const tokenQuery = token ? `&token=${encodeURIComponent(token)}` : '';
    this.socket = new WebSocket(`${environment.wsUrl}?boardId=${boardId}${tokenQuery}`);
    this.socket.onmessage = (event) => this.message$.next(JSON.parse(event.data));
    this.socket.onclose = () => timer(2000).subscribe(() => this.connect(boardId));
    return this.message$.asObservable();
  }

  send(message: WsMessage): void {
    this.socket?.send(JSON.stringify(message));
  }
}
