import {Injectable} from '@angular/core';
import {GetPhoneNumber} from "../../../../../utils/storage";

@Injectable()
export class UserCardHintService {
  public getState(): boolean | undefined {
    const didTheUserViewTheTipMoreThanFourTimes: boolean =
      localStorage.getItem('NumberOfTimesTheHintHasBeenViewed' + '_' + GetPhoneNumber()) &&
      Boolean(Number(localStorage.getItem('NumberOfTimesTheHintHasBeenViewed' + '_' + GetPhoneNumber())) >= 4)
    if (didTheUserViewTheTipMoreThanFourTimes) {
      return true;
    }
    return undefined;
  }

  public setState() {
    let counter: number = Number(localStorage.getItem('NumberOfTimesTheHintHasBeenViewed'+ '_' + GetPhoneNumber()));
    if (counter) {
      counter++;
      localStorage.setItem('NumberOfTimesTheHintHasBeenViewed' + '_' + GetPhoneNumber(), JSON.stringify(counter));
      return;
    }
    localStorage.setItem('NumberOfTimesTheHintHasBeenViewed' + '_' + GetPhoneNumber(), JSON.stringify(1));
  }
}
