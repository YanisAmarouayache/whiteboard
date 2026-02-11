import { Injectable } from '@angular/core';

@Injectable()
export class HistoryService<T> {
  private readonly undoStack: T[] = [];
  private readonly redoStack: T[] = [];

  push(state: T): void {
    this.undoStack.push(state);
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
