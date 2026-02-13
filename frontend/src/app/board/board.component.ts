import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { BoardFacade } from './facades/board.facade';
import { Board } from '../core/models/board';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnDestroy {
  readonly boards$: Observable<Board[]>;
  readonly selectedBoardId$: Observable<string>;
  private readonly destroy$ = new Subject<void>();
  private autoSaveSub?: Subscription;

  constructor(
    private readonly facade: BoardFacade,
    private readonly router: Router
  ) {
    this.boards$ = this.facade.boards$;
    this.selectedBoardId$ = this.facade.selectedBoardId$;
  }

  ngOnInit(): void {
    this.facade
      .initialize()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.autoSaveSub = this.facade.bindAutoSave();
        },
        error: () => {
          void this.router.navigate(['/login']);
        }
      });
  }

  onBoardChange(boardId: string): void {
    this.facade.changeBoard(boardId);
  }

  @HostListener('window:beforeunload')
  onBeforeUnload(): void {
    this.facade.flushBeforeUnload();
  }

  ngOnDestroy(): void {
    this.autoSaveSub?.unsubscribe();
    this.facade.saveNow();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
