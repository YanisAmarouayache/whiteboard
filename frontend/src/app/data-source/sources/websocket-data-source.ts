import { Observable } from 'rxjs';
import { DataSource } from '../data-source.interface';

export class WebsocketDataSource<T = unknown> extends DataSource<T> {
  private socket?: WebSocket;

  constructor(private readonly url: string) {
    super();
  }

  connect(): Observable<T> {
    return new Observable<T>((subscriber) => {
      this.socket = new WebSocket(this.url);
      this.socket.onmessage = (event) => subscriber.next(JSON.parse(event.data) as T);
      this.socket.onerror = (error) => subscriber.error(error);
      this.socket.onclose = () => subscriber.complete();
      return () => this.disconnect();
    });
  }

  disconnect(): void {
    this.socket?.close();
    this.socket = undefined;
  }
}
