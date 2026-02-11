import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, debounceTime, distinctUntilChanged, map, skip, takeUntil } from 'rxjs';
import { BoardState } from './models/board-state';
import { BoardStateService } from './board-state.service';
import { BoardApiService } from '../core/services/board-api.service';
import { Router } from '@angular/router';
import { WidgetInstance } from './models/widget-instance';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnDestroy {
  readonly state$: Observable<BoardState>;
  private readonly destroy$ = new Subject<void>();
  private saveInFlight = false;
  private pendingSave = false;
  private persistedKey = '';

  constructor(
    private readonly boardState: BoardStateService,
    private readonly boardApi: BoardApiService,
    private readonly router: Router
  ) {
    this.state$ = this.boardState.state$;
  }

  ngOnInit(): void {
    this.boardApi.bootstrap().subscribe({
      next: (res) => {
        const state: BoardState = {
          id: res.board.id,
          name: res.board.name,
          version: res.board.version,
          transform: { x: 0, y: 0, scale: 1 },
          widgets: (res.board.state?.widgets as WidgetInstance[]) ?? []
        };
        this.boardState.replace(state);
        this.persistedKey = this.serializeState(state);
      },
      error: () => {
        void this.router.navigate(['/login']);
      }
    });

    this.state$
      .pipe(
        skip(1),
        map((state) => ({ id: state.id, widgets: state.widgets })),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        debounceTime(250),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.saveState();
      });
  }

  @HostListener('window:beforeunload')
  onBeforeUnload(): void {
    const state = this.boardState.snapshot();
    if (!state.id) return;
    const currentKey = this.serializeState(state);
    if (currentKey === this.persistedKey) return;
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    void fetch(`${environment.apiUrl}/boards/${state.id}`, {
      method: 'PUT',
      keepalive: true,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ widgets: state.widgets, version: state.version })
    });
  }

  private saveState(): void {
    const state = this.boardState.snapshot();
    if (!state.id) return;
    const currentKey = this.serializeState(state);
    if (currentKey === this.persistedKey) return;

    if (this.saveInFlight) {
      this.pendingSave = true;
      return;
    }

    this.saveInFlight = true;
    this.boardApi.update(state.id, { widgets: state.widgets, version: state.version }).subscribe({
      next: () => {
        this.persistedKey = currentKey;
        this.boardState.markPersisted();
        this.saveInFlight = false;
        if (this.pendingSave) {
          this.pendingSave = false;
          this.saveState();
        }
      },
      error: () => {
        this.saveInFlight = false;
      }
    });
  }

  private serializeState(state: Pick<BoardState, 'id' | 'widgets'>): string {
    return JSON.stringify({ id: state.id, widgets: state.widgets });
  }

  ngOnDestroy(): void {
    this.saveState();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
