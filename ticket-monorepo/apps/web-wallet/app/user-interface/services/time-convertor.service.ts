import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimeConvertorService {

  minutesToSeconds(minutes: number): number {
    return minutes * 60;
  }
}
