import { Component, EventEmitter, Inject, Input, OnDestroy, Output } from '@angular/core';
import { DOCUMENT } from '@angular/common';

type InputTimeType = 'MILLI_SECOND' | 'SECOND' | 'MINUTE';

@Component({
  selector: 'ui-remaining-time',
  templateUrl: './ui-remaining-time.component.html',
  styleUrls: ['./ui-remaining-time.component.scss']
})
export class UiRemainingTimeComponent implements OnDestroy {
  @Input()
  hasDescription = true;
  @Input()
  time: number;
  @Input()
  timeType: InputTimeType = 'SECOND';
  @Output()
  finish: EventEmitter<any> = new EventEmitter();
  @Output()
  returnRemainingTime: EventEmitter<number> = new EventEmitter();

  minutes: number;
  seconds: number;
  milliseconds: number = 0;
  formattedMinutes: string;
  formattedSeconds: string;

  latestCurrentTime;
  remainingTime;
  interval;

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) {
  }

  ngOnInit(): void {
    this.remainingTime = this.time;
    this.startTimer(this.time, this.timeType);
    this.document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
  }

  private handleVisibilityChange(): void {
    if (this.document.hidden) {
      this.latestCurrentTime = new Date().getTime();
      clearInterval(this.interval);
    } else {
      this.resumeTimer();
    }
  }

  private resumeTimer(): void {
    // deference is milliSecond.
    const deference = this.remainingTime - (new Date().getTime() - this.latestCurrentTime);
    if (isNaN(deference)) {
      this.finishTimer();
      return;
    } else if (deference < 1 || this.remainingTime < 1) {
      this.finishTimer();
      return;
    } else {
      this.startTimer(deference, 'MILLI_SECOND');
    }
  }

  private finishTimer(): void {
    this.formattedMinutes = '0';
    this.formattedSeconds = '0';
    this.finish.emit(true);
  }

  private startTimer(time: number, timeType: InputTimeType): void {
    if (this.interval) {
      clearInterval(this.interval);
    }

    this.interval = setInterval(() => {
      this.updateTimer();
    }, 1000);

    this.minutes = Math.floor(UiRemainingTimeComponent.expectedSecond(time, timeType) / 60);
    this.seconds = UiRemainingTimeComponent.expectedSecond(time, timeType) % 60;
    if (timeType === 'MILLI_SECOND') {
      this.milliseconds = time % 1000;
    }
    this.updateTimer();
  }

  private updateTimer(): void {
    if (this.seconds > 0) {
      this.seconds--;
    } else if (this.minutes > 0) {
      this.minutes--;
      this.seconds = 59;
    } else if (this.minutes === 0 && this.seconds === 0) {
      this.finish.emit(true);
      clearInterval(this.interval);
    }
    this.remainingTime = this.timeToMilliseconds();
    this.formattedMinutes = this.minutes.toString().padStart(2, '0');
    this.formattedSeconds = this.seconds.toString().padStart(2, '0');
    this.returnRemainingTime.emit(this.remainingTime);
  }

  private static expectedSecond(time: number, timeType: InputTimeType): number {
    switch (timeType) {
      case 'SECOND':
        return time;
      case 'MILLI_SECOND':
        return Math.floor(time / 1000);
      case 'MINUTE':
        return time * 60;
    }
  }

  private timeToMilliseconds(): number {
    return (this.minutes * 60 + this.seconds) * 1000 + this.milliseconds;
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }
}
