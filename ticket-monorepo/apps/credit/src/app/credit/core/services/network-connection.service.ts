import { Injectable } from '@angular/core';
import { Observable, Observer, fromEvent, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class NetworkConnectionService {

  constructor(
    private messageService: MessageService,
  ) {
  }

  onConnectionStatusChange() {
    return merge(
      fromEvent(window, 'offline').pipe(map(() => false)),
      fromEvent(window, 'online').pipe(map(() => true)),
      new Observable((sub: Observer<boolean>) => {
        sub.next(navigator.onLine);
        sub.complete();
      }));
  }

  disconnectedMessage() {
    this.messageService.showErrorMessage('لطفا اتصال اینترنت را بررسی کنید');
  }

  reConnectedMessage() {
    this.messageService.showErrorMessage('اتصال اینترنت برقرار شد');
  }
}
