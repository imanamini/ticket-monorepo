import { Injectable } from '@angular/core';
import { PERSISTENT_STORAGE_KEYS } from '../../core/constants';

@Injectable()
export class TimerService {
  public timer = 0;
  public timeKey: string;
  public minutes: number;
  public startTime: Date = new Date();

  private static addMinutes(endTime, minutes): number {
    return new Date(endTime + (minutes * 60000)).getTime();
  }

  public initial(timeKey: PERSISTENT_STORAGE_KEYS, ticket: string, minutes: number): void {
    this.timeKey = timeKey + ticket;
    this.minutes = minutes;
    this.start();
  }

  private start(): void {
    this.startTime = new Date();
    const endTime: number = this.updateEndTime();
    this.timer = this.getDifferenceMinutes(endTime);
  }

  private getDifferenceMinutes(endTime: number): number {
    if (endTime <= this.startTime.getTime()) {
      return 0;
    }
    return Math.ceil((endTime - this.startTime.getTime()) / 1000);
  }

  private updateEndTime(): number {
    const savedEndTime: number = Number(sessionStorage.getItem(this.timeKey));
    if (savedEndTime) {
      return savedEndTime;
    } else {
      const endTime = TimerService.addMinutes(new Date().getTime(), this.minutes);
      sessionStorage.setItem(this.timeKey, JSON.stringify(endTime));
      return endTime;
    }
  }
}
