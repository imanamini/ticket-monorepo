import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, delay, fromEvent, merge, Observable } from 'rxjs';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class InternetConnectionLostService {
  private isOfflineSource = new BehaviorSubject<boolean>(!navigator.onLine);

  isOffline = signal<boolean>(!navigator.onLine);

  constructor() {
    merge(
      fromEvent(window, 'online'),
      fromEvent(window, 'offline'))
      .subscribe(() => this.updateOnlineStatus());
  }

  public updateOnlineStatus(): void {
    this.isOffline.set(!navigator.onLine);
    this.isOfflineSource.next(!navigator.onLine);
  }

  get isOffline$(): Observable<boolean> {
    return this.isOfflineSource.asObservable();
  }
}
