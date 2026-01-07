import { Injectable, signal } from '@angular/core';
import { finalize, ignoreElements, merge, Observable, take, tap, timer } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class BarcodeLoadingService {
  loading = signal<boolean>(false);

  showLoading() {
    this.loading.set(true);
  }

  hideLoading() {
    this.loading.set(false);
  }

  timerLoading<T>(observer: Observable<T>, ms = 1000): Observable<T> {
    return merge(
      observer.pipe(finalize(() => this.hideLoading())),
      timer(ms).pipe(
        tap(() => this.showLoading()),
        ignoreElements(),
      ),
    ).pipe(take(1));
  }
}
