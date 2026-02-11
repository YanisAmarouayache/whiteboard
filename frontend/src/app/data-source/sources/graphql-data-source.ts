import { from, Observable } from 'rxjs';
import { DataSource, DataSourceConfig } from '../data-source.interface';

export class GraphqlDataSource<T = unknown> extends DataSource<T> {
  constructor(private readonly config: DataSourceConfig) {
    super();
  }

  connect(): Observable<T> {
    return from(
      fetch(this.config.endpoint ?? '', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(this.config.headers ?? {}) },
        body: JSON.stringify({ query: this.config.query })
      })
        .then((r) => r.json())
        .then((payload) => payload.data as T)
    );
  }

  disconnect(): void {}
}
