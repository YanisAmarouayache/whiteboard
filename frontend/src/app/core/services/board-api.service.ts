import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Board } from '../models/board';
import { Workspace } from '../models/workspace';
import { User } from '../models/user';
import { environment } from '../../../environments/environment';

interface BootstrapResponse {
  user: User;
  workspace: Workspace;
  board: Board;
  boards: Board[];
}

@Injectable({ providedIn: 'root' })
export class BoardApiService {
  constructor(private readonly api: ApiService) {}

  bootstrap() {
    return this.api.get<BootstrapResponse>('/bootstrap');
  }

  list(workspaceId: string) {
    return this.api.get<Board[]>(`/workspaces/${workspaceId}/boards`);
  }

  get(boardId: string) {
    return this.api.get<Board>(`/boards/${boardId}`);
  }

  update(boardId: string, payload: { widgets: unknown[]; version: number }) {
    return this.api.put<void>(`/boards/${boardId}`, payload);
  }

  keepaliveUpdate(boardId: string, payload: { widgets: unknown[]; version: number }, token: string): void {
    void fetch(`${environment.apiUrl}/boards/${boardId}`, {
      method: 'PUT',
      keepalive: true,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
  }
}
