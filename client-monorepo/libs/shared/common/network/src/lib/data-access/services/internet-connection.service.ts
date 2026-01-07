import { Injectable } from '@angular/core';
import { BehaviorSubject, debounceTime, fromEvent, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InternetConnectionService {
  private onlineEvent = fromEvent(window, 'online');
  private offlineEvent = fromEvent(window, 'offline');
  private timeOutError: Subject<boolean> = new BehaviorSubject<boolean>(false);

  public getOnlineEvent(): Observable<any> {
    return this.onlineEvent.pipe(debounceTime(300));
  }

  public getOfflineEvent(): Observable<any> {
    return this.offlineEvent.pipe(debounceTime(300));
  }

  setTimeoutError(isTimedOut: boolean): void {
    this.timeOutError.next(isTimedOut);
  }

  getTimeoutError(): Observable<boolean> {
    return this.timeOutError.asObservable();
  }
}
