import { Observable } from 'rxjs';

export interface DataSourceConfig {
  type: 'static' | 'rest' | 'websocket' | 'graphql' | 'function';
  endpoint?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
  query?: string;
  staticData?: unknown;
  compute?: () => unknown;
}

export abstract class DataSource<T = unknown> {
  abstract connect(): Observable<T>;
  abstract disconnect(): void;
}
