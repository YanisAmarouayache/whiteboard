import { Injectable } from '@angular/core';

@Injectable()
export class HistoryService<T> {
  private static readonly MAX_HISTORY = 200;
  private readonly undoStack: T[] = [];
  private readonly redoStack: T[] = [];

  push(state: T): void {
    this.undoStack.push(state);
    if (this.undoStack.length > HistoryService.MAX_HISTORY) {
      this.undoStack.shift();
    }
    this.redoStack.length = 0;
  }

  undo(current: T): T | undefined {
    const prev = this.undoStack.pop();
    if (prev) {
      this.redoStack.push(current);
    }
    return prev;
  }

  redo(current: T): T | undefined {
    const next = this.redoStack.pop();
    if (next) {
      this.undoStack.push(current);
    }
    return next;
  }
}
