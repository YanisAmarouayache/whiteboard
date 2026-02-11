import { from, Observable } from 'rxjs';
import { DataSource, DataSourceConfig } from '../data-source.interface';

export class RestDataSource<T = unknown> extends DataSource<T> {
  constructor(private readonly config: DataSourceConfig) {
    super();
  }

  connect(): Observable<T> {
    const method = this.config.method ?? 'GET';
    return from(
      fetch(this.config.endpoint ?? '', {
        method,
        headers: this.config.headers,
        body: this.config.body ? JSON.stringify(this.config.body) : undefined
      }).then((r) => r.json())
    );
  }

  disconnect(): void {}
}
