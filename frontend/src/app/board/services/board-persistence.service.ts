import { Injectable } from '@angular/core';
import { BoardState } from '../models/board-state';
import { BoardApiService } from '../../core/services/board-api.service';
import { BoardStateService } from '../board-state.service';
import { AuthService } from '../../core/services/auth.service';

interface DirtyStateSnapshot {
  state: BoardState;
  stateKey: string;
}

@Injectable()
export class BoardPersistenceService {
  private saveInFlight = false;
  private pendingSave = false;
  private persistedKey = '';

  constructor(
    private readonly boardApi: BoardApiService,
    private readonly boardState: BoardStateService,
    private readonly auth: AuthService
  ) {}

  markLoaded(state: Pick<BoardState, 'id' | 'widgets'>): void {
    this.persistedKey = this.serializeState(state);
  }

  saveCurrentState(): void {
    const snapshot = this.getDirtySnapshot();
    if (!snapshot) return;
    const { state, stateKey } = snapshot;

    if (this.saveInFlight) {
      this.pendingSave = true;
      return;
    }

    this.saveInFlight = true;
    this.boardApi.update(state.id, { widgets: state.widgets, version: state.version }).subscribe({
      next: () => {
        this.persistedKey = stateKey;
        this.boardState.markPersisted();
        this.saveInFlight = false;
        if (this.pendingSave) {
          this.pendingSave = false;
          this.saveCurrentState();
        }
      },
      error: () => {
        this.saveInFlight = false;
        this.pendingSave = false;
      }
    });
  }

  flushKeepalive(): void {
    const snapshot = this.getDirtySnapshot();
    if (!snapshot) return;
    const { state } = snapshot;

    const token = this.auth.getToken();
    if (!token) return;
    this.boardApi.keepaliveUpdate(state.id, { widgets: state.widgets, version: state.version }, token);
  }

  private getDirtySnapshot(): DirtyStateSnapshot | null {
    const state = this.boardState.snapshot();
    if (!state.id) return null;

    const stateKey = this.serializeState(state);
    if (stateKey === this.persistedKey) return null;

    return { state, stateKey };
  }

  private serializeState(state: Pick<BoardState, 'id' | 'widgets'>): string {
    return JSON.stringify({ id: state.id, widgets: state.widgets });
  }
}
