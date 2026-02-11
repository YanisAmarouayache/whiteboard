import { Observable, Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DataSource } from '../data-source.interface';

export class PollingDataSource<T = unknown> extends DataSource<T> {
  private sub?: Subscription;

  constructor(private readonly source: DataSource<T>, private readonly intervalMs = 5000) {
    super();
  }

  connect(): Observable<T> {
    return new Observable<T>((subscriber) => {
      this.sub = interval(this.intervalMs)
        .pipe(switchMap(() => this.source.connect()))
        .subscribe(subscriber);
      return () => this.disconnect();
    });
  }

  disconnect(): void {
    this.sub?.unsubscribe();
    this.source.disconnect();
  }
}
