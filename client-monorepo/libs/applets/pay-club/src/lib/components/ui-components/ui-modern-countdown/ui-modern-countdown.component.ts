import { ChangeDetectorRef, Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pay-club-applet-ui-modern-countdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-modern-countdown.component.html',
  styleUrls: ['./ui-modern-countdown.component.scss'],
})
export class UiModernCountdownComponent implements OnInit, OnDestroy {
  @Input()
  seconds!: number;

  @Input()
  size = 36;

  @Input()
  theme: 'SIMPLE' | 'DARK' = 'SIMPLE';

  @Output()
  finished = new EventEmitter<boolean>();

  timeoutSubscription!: Subscription;

  private changeDetectorRef = inject(ChangeDetectorRef);

  timeParts: {
    days: string | number;
    hour: string | number;
    minutes: string | number;
    seconds: string | number;
  } = {
    days: 0,
    hour: 0,
    minutes: 0,
    seconds: 0,
  };

  ngOnInit(): void {
    this.timeoutSubscription = interval(1000).subscribe(() => {
      if (this.seconds > 0) {
        this.seconds--;
        this.formatTime();
      } else {
        this.formatTime();
        this.finished.emit(true);
        this.timeoutSubscription.unsubscribe();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.timeoutSubscription) {
      this.timeoutSubscription.unsubscribe();
    }
  }

  private pan(value: number): string {
    if (value < 10) {
      // @ts-expect-error value
      value = '0' + String(value);
    }

    return String(value);
  }

  private formatTime(): void {
    const seconds = Number(this.seconds);

    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    this.timeParts = {
      minutes: this.pan(m),
      seconds: this.pan(s),
      hour: this.pan(h),
      days: d,
    };
    this.changeDetectorRef.markForCheck();
  }
}
