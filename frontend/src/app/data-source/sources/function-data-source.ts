import { Observable, of } from 'rxjs';
import { DataSource } from '../data-source.interface';

export class FunctionDataSource<T = unknown> extends DataSource<T> {
  constructor(private readonly compute: () => T) {
    super();
  }

  connect(): Observable<T> {
    return of(this.compute());
  }

  disconnect(): void {}
}
