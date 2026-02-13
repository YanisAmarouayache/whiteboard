import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  debounceTime,
  map,
  skip,
  tap
} from 'rxjs';
import { BoardState } from '../models/board-state';
import { BoardStateService } from '../board-state.service';
import { BoardApiService } from '../../core/services/board-api.service';
import { WidgetInstance } from '../models/widget-instance';
import { Board } from '../../core/models/board';
import { BoardPersistenceService } from '../services/board-persistence.service';

@Injectable()
export class BoardFacade {
  readonly state$: Observable<BoardState>;
  private readonly boardsSubject = new BehaviorSubject<Board[]>([]);
  private readonly selectedBoardIdSubject = new BehaviorSubject<string>('');
  readonly boards$ = this.boardsSubject.asObservable();
  readonly selectedBoardId$ = this.selectedBoardIdSubject.asObservable();

  constructor(
    private readonly boardState: BoardStateService,
    private readonly boardApi: BoardApiService,
    private readonly persistence: BoardPersistenceService
  ) {
    this.state$ = this.boardState.state$;
  }

  initialize(): Observable<void> {
    return this.boardApi.bootstrap().pipe(
      tap((res) => {
        this.boardsSubject.next(res.boards);
        this.selectedBoardIdSubject.next(res.board.id);
        this.loadBoardIntoState(res.board);
      }),
      map(() => void 0)
    );
  }

  bindAutoSave(): Subscription {
    return this.state$
      .pipe(
        skip(1),
        map((state) => state.id),
        debounceTime(250)
      )
      .subscribe(() => {
        this.persistence.saveCurrentState();
      });
  }

  changeBoard(boardId: string): void {
    if (!boardId || boardId === this.selectedBoardIdSubject.value) return;
    this.persistence.saveCurrentState();
    this.boardApi.get(boardId).subscribe({
      next: (board) => {
        this.selectedBoardIdSubject.next(board.id);
        this.loadBoardIntoState(board);
      },
      error: (error: unknown) => {
        // Keep current board selected and log for diagnostics.
        console.error('Failed to load board', error);
      }
    });
  }

  flushBeforeUnload(): void {
    this.persistence.flushKeepalive();
  }

  saveNow(): void {
    this.persistence.saveCurrentState();
  }

  private loadBoardIntoState(board: Board): void {
    const state: BoardState = {
      id: board.id,
      name: board.name,
      version: board.version,
      transform: { x: 0, y: 0, scale: 1 },
      widgets: this.normalizeWidgets(board.state?.widgets)
    };
    this.boardState.replace(state);
    this.persistence.markLoaded(state);
  }

  private normalizeWidgets(raw: unknown): WidgetInstance[] {
    if (!Array.isArray(raw)) return [];
    return raw.filter(this.isWidgetInstance);
  }

  private isWidgetInstance = (value: unknown): value is WidgetInstance => {
    if (!value || typeof value !== 'object') return false;
    const candidate = value as Partial<WidgetInstance>;
    return (
      typeof candidate.id === 'string' &&
      typeof candidate.type === 'string' &&
      typeof candidate.x === 'number' &&
      typeof candidate.y === 'number' &&
      typeof candidate.width === 'number' &&
      typeof candidate.height === 'number' &&
      !!candidate.config &&
      typeof candidate.config === 'object'
    );
  };
}
