import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface PresenceState {
  userId: string;
  cursorX: number;
  cursorY: number;
}

@Injectable({ providedIn: 'root' })
export class PresenceService {
  private readonly usersSubject = new BehaviorSubject<PresenceState[]>([]);
  readonly users$ = this.usersSubject.asObservable();

  upsert(state: PresenceState): void {
    const users = this.usersSubject.value.filter((u) => u.userId !== state.userId);
    this.usersSubject.next([...users, state]);
  }
}
