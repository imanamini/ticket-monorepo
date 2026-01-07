import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { LoginResponse } from '../../../components/core/models/login-response.model';

@Injectable({
  providedIn: 'root',
})
export class EnterPasswordService {
  /**
   * Gets true when we want to get password from user
   */
  enterPassword: BehaviorSubject<boolean> = new BehaviorSubject(false);

  /**
   * Login subject
   */
  login: BehaviorSubject<LoginResponse> = new BehaviorSubject(null);

  /**
   * Holds the codes of the verified features.
   * gets clean in some certain points.
   */
  verified: BehaviorSubject<Array<number>> = new BehaviorSubject<Array<number>>(
    [],
  );

  /**
   * Hold the code of the features that currently are
   * being verified. gets clean after each flow.
   */
  features: Array<number> = [];

  constructor() {
    this.enterPassword.asObservable().subscribe((isOpen) => {
      if (isOpen) {
        if (!document.body.classList.contains('')) {
          document.body.classList.add('forced-to-enter-password');
        }
      } else {
        document.body.classList.remove('forced-to-enter-password');
      }
    });
  }

  /**
   * Hides the enter password window
   */
  hideGetPasswordWindow() {
    this.enterPassword.next(false);

    return this;
  }

  /**
   * Starts a new flow for getting user's password
   * @param userId
   * @param features
   */
  getUserPassword(userId: any, features: Array<number>) {
    // this.userId = userId;
    this.features = features;
    this.enterPassword.next(true);
    return this;
  }

  /**
   * Clears the all service data
   * (usually after a successful verification)
   */
  clearData() {
    // this.userId = null;
    this.features = [];
    this.verified = new BehaviorSubject<Array<number>>([]);
    this.login = new BehaviorSubject<LoginResponse | null>(null);

    return this;
  }

  onLogin() {
    return this.login.asObservable();
  }

  /**
   * Should be called after a successful verification.
   * Mark feature codes as verified.
   */
  markFeaturesAsVerified() {
    this.verified.next(this.features);
    return this;
  }

  setFeatures(features: Array<number>) {
    this.features = features;
  }
}
