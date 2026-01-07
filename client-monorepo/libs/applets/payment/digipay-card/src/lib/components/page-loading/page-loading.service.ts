import { Injectable, signal } from '@angular/core';
import { finalize, ignoreElements, materialize, merge, Observable, take, takeUntil, tap, timer } from 'rxjs';

@Injectable()
export class PageLoadingService {
  loading = signal<boolean>(false);

  showLoading() {
    this.loading.set(true);
  }

  hideLoading() {
    this.loading.set(false);
  }

  timerLoading<T>(observer: Observable<T>, ms = 1000): Observable<T> {
    const done$ = observer.pipe(materialize(), take(1));

    return merge(
      observer,
      timer(ms).pipe(
        takeUntil(done$),         
        tap(() => this.showLoading()),
        ignoreElements(),
      ),
    ).pipe(
      finalize(() => this.hideLoading()), 
    );
  }
}
