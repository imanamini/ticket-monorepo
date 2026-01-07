import { computed, inject, Injectable } from '@angular/core';
import { StorageService } from '@client-monorepo/common/utilities';

@Injectable({
  providedIn: 'root',
})
export class UserCardHintService {
  storageService = inject(StorageService);
  userPhoneNumber = computed(() => this.storageService.getUserData()?.phoneNumber);
  public getState(): boolean | undefined {
    const didTheUserViewTheTipMoreThanFourTimes =
      localStorage.getItem('NumberOfTimesTheHintHasBeenViewed' + '_' + this.userPhoneNumber()) &&
      Boolean(Number(localStorage.getItem('NumberOfTimesTheHintHasBeenViewed' + '_' + this.userPhoneNumber())) >= 4);
    if (didTheUserViewTheTipMoreThanFourTimes) {
      return true;
    }
    return undefined;
  }

  public setState() {
    let counter = Number(localStorage.getItem('NumberOfTimesTheHintHasBeenViewed' + '_' + this.userPhoneNumber()));
    if (counter) {
      counter++;
      localStorage.setItem('NumberOfTimesTheHintHasBeenViewed' + '_' + this.userPhoneNumber(), JSON.stringify(counter));
      return;
    }
    localStorage.setItem('NumberOfTimesTheHintHasBeenViewed' + '_' + this.userPhoneNumber(), JSON.stringify(1));
  }
}
