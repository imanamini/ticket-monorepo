import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Inject,
  input,
  model,
  OnDestroy,
  OnInit,
  output,
  signal
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { CircleTimerComponent } from '../barcode-circle-timer/barcode-circle-timer.component';

type InputTimeType = 'MILLI_SECOND' | 'SECOND' | 'MINUTE';

@Component({
  selector: 'lib-barcode-remaining-time',
  standalone: true,
  imports: [CommonModule, CircleTimerComponent],
  templateUrl: './barcode-remaining-time.component.html',
  styleUrl: './barcode-remaining-time.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarcodeRemainingTimeComponent implements OnInit, OnDestroy {
  hasDescription = input<boolean>(true);
  hasCircleTimer = input<boolean>(true);
  timestamp = model.required<number>();
  remainingTime = signal<number>(0);
  time = computed(() => {
    return this.timestamp() - new Date().getTime();
  });
  loadingFillColor = computed(() => {
    const waitingRatio = 1 / 6;
    return this.remainingTime() / this.time() < waitingRatio ? '#F9441F' : '#45474A';
  });
  timeType = input<InputTimeType>('SECOND');
  finished = output<void>();
  returnRemainingTime = output<number>();

  milliseconds = 0;
  minutes!: number;
  seconds!: number;
  formattedMinutes = signal<string>('');
  formattedSeconds = signal<string>('');

  latestCurrentTime!: number;

  interval!: any;
  private boundHandleVisibilityChange: () => void;
  private destroyed = false;

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.boundHandleVisibilityChange = this.handleVisibilityChange.bind(this);
  }

  ngOnInit(): void {
    this.remainingTime.set(this.time());
    this.startTimer(this.time(), this.timeType());
    this.document.addEventListener('visibilitychange', this.boundHandleVisibilityChange);
  }

  private handleVisibilityChange(): void {
    if (this.destroyed) return;
    if (this.document.hidden) {
      this.latestCurrentTime = new Date().getTime();
      clearInterval(this.interval);
    } else {
      this.resumeTimer();
    }
  }

  private resumeTimer(): void {
    const deference = this.remainingTime() - (new Date().getTime() - this.latestCurrentTime);
    if (isNaN(deference)) {
      this.finishTimer();
      return;
    } else if (deference < 1 || this.remainingTime() < 1) {
      this.finishTimer();
      return;
    } else {
      this.startTimer(deference, 'MILLI_SECOND');
    }
  }

  private finishTimer(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.formattedMinutes.set('0');
    this.formattedSeconds.set('0');
    if (!this.destroyed) {
      this.finished.emit();
    }
  }

  private startTimer(time: number, timeType: InputTimeType): void {
    if (this.interval) {
      clearInterval(this.interval);
    }

    this.minutes = Math.floor(BarcodeRemainingTimeComponent.expectedSecond(time, timeType) / 60);
    this.seconds = BarcodeRemainingTimeComponent.expectedSecond(time, timeType) % 60;

    this.milliseconds = timeType === 'MILLI_SECOND' ? time % 1000 : 0;

    this.interval = setInterval(() => {
      this.updateTimer();
    }, 1000);

    this.updateTimer();
  }

  private updateTimer(): void {
    if (this.destroyed) return;

    if (this.seconds > 0) {
      this.seconds--;
    } else if (this.minutes > 0) {
      this.minutes--;
      this.seconds = 59;
    } else if (this.minutes === 0 && this.seconds === 0) {
      this.finished.emit();
      clearInterval(this.interval);
    }
    this.remainingTime.set(this.timeToMilliseconds());
    this.formattedMinutes.set(this.minutes.toString().padStart(2, '0'));
    this.formattedSeconds.set(this.seconds.toString().padStart(2, '0'));
    this.returnRemainingTime.emit(this.remainingTime());
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

  public resetTimer(ttl?: number): void {
    clearInterval(this.interval);
    if (ttl) {
      this.timestamp.set(ttl);
    }
    this.remainingTime.set(this.time());
    this.startTimer(this.time(), this.timeType());
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.document.removeEventListener('visibilitychange', this.boundHandleVisibilityChange);
    clearInterval(this.interval);
  }
}
