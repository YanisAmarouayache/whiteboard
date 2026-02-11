import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SelectionService {
  private readonly selectedIdsSubject = new BehaviorSubject<string[]>([]);
  readonly selectedIds$ = this.selectedIdsSubject.asObservable();

  set(ids: string[]): void {
    this.selectedIdsSubject.next(ids);
  }

  clear(): void {
    this.set([]);
  }
}
