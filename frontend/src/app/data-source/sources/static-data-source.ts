import { Observable, of } from 'rxjs';
import { DataSource } from '../data-source.interface';

export class StaticDataSource<T = unknown> extends DataSource<T> {
  constructor(private readonly value: T) {
    super();
  }

  connect(): Observable<T> {
    return of(this.value);
  }

  disconnect(): void {}
}
