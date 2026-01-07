import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class UsedJourneyService {
  saveJourneyUserId(userId): void {
    if (userId) {
      localStorage.setItem('journey_user_id', userId);
    }
  }

  getJourneyUserId(): string {
    return localStorage.getItem('journey_user_id');
  }

  purgeJourneyUserId(): void {
    localStorage.removeItem('journey_user_id');
  }
}
