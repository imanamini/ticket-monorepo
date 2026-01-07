import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ProfileInterface } from '../models/profile.interface';
import { UserApiService } from './user-api.service';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  userDetail = new BehaviorSubject<ProfileInterface | null>(null);

  constructor(private userApiService: UserApiService) {}

  /**
   * I Really suggest to use this method for getting the
   * current user data (like cell number)
   *
   * There is some considerations and potential bugs in other methods.
   *
   */
  getUserDetail(): Promise<ProfileInterface> {
    return new Promise((resolve, reject) => {
      const user = this.userDetail.getValue();
      if (user) {
        resolve(user);
      } else {
        const profileSubscription: Subscription = this.userApiService.getProfile().subscribe({
          next: (result) => {
            this.userDetail.next(result);
            resolve(result);
          },
          error: (err) => {
            // it might need to handle fatalErrorService
            reject(err);
          },
          complete: () => profileSubscription.unsubscribe(),
        });
      }
    });
  }
}
