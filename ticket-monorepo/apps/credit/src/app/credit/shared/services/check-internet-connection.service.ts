import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class CheckInternetConnectionService {
  private isConnect = new BehaviorSubject(true);

  constructor() { }

  /*check internet connetction*/
  checkInternetconection(isConnected: any) {
    this.isConnect.next(isConnected);
  }
  responseCheckInternetconection() {
    return this.isConnect.asObservable();
  }
}
