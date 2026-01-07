import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';

@Injectable()
export class UserService {

  /**
   * Dispatches the  logged-in user's data
   */
  public userHasPassword = new BehaviorSubject<boolean>(false);

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor() {

    this.isAuthenticatedSubject.subscribe(isAuthenticated => {
    });
  }
}
