import { BehaviorSubject } from 'rxjs';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { LoginResponse } from '../../../api/digipay/models/login-response.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class EnterPasswordService {
  /**
   * Current user's ID
   * Used at login API
   */
  userId: string;

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
  verified: BehaviorSubject<Array<number>> = new BehaviorSubject([]);

  /**
   * Hold the code of the features that currently are
   * being verified. gets clean after each flow.
   */
  features: Array<number> = [];

  constructor(@Inject(PLATFORM_ID) public platformId: string) {
    if (isPlatformBrowser(this.platformId)) {
      this.enterPassword.asObservable().subscribe((isOpen) => {
        // if (isOpen) {
        //   if (!document.body.classList.contains('')) {
        //     document.body.classList.add('forced-to-enter-password');
        //   }
        // } else {
        //   document.body.classList.remove('forced-to-enter-password');
        // }
      });
    }
  }

  /**
   * Subscribe to a login subject and act upon login
   */
  onLogin() {
    return this.login.asObservable();
  }

  /**
   * Hides the entered password window
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
  getUserPassword(userId, features: Array<number>) {
    this.userId = userId;
    this.features = features;
    this.enterPassword.next(true);
    return this;
  }

  /**
   * Clears the all service data
   * (usually after a successful verification)
   */
  clearData() {
    this.userId = null;
    this.features = [];
    this.verified = new BehaviorSubject([]);
    this.login = new BehaviorSubject(null);

    return this;
  }

  /**
   * Should be called after successful verification.
   * Mark feature codes as verified.
   */
  markFeaturesAsVerified() {
    this.verified.next(this.features);
    return this;
  }

  /**
   * Check if a feature code is verified or not
   * @param featureCode
   */
  isVerified(featureCode: number) {
    return this.verified.value.indexOf(featureCode) >= 0;
  }
}
