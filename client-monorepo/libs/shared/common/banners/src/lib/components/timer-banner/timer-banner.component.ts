import { ChangeDetectionStrategy, Component, computed, input, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiImageComponent } from '@digipay/ng-ui-api-image';

@Component({
  selector: 'common-app-banners-timer-banner',
  standalone: true,
  imports: [CommonModule, ApiImageComponent],
  templateUrl: './timer-banner.component.html',
  styleUrl: './timer-banner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerBannerComponent implements OnInit, OnDestroy {
  // Inputs
  imageId = input<string | undefined>(undefined);
  targetTimeStamp = input<number>(0);

  // Variable
  protected readonly Object = Object;
  private intervalId?: number;
  hours = signal<number>(0);
  minutes = signal<number>(0);
  seconds = signal<number>(0);
  time = computed(() => {
    return {
      hour: this.padZero(this.hours()),
      minute: this.padZero(this.minutes()),
      second: this.padZero(this.seconds()),
    };
  });

  ngOnInit(): void {
    this.startCountdown();
  }

  private startCountdown() {
    this.updateTimer();

    this.intervalId = window.setInterval(() => {
      this.updateTimer();
    }, 1000);
  }

  private updateTimer() {
    const now = Date.now();
    const diff = Math.floor((this.targetTimeStamp() - now) / 1000);

    if (diff <= 0) {
      this.hours.set(0);
      this.minutes.set(0);
      this.seconds.set(0);

      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
      return;
    }

    this.hours.set(Math.floor(diff / 3600));
    this.minutes.set(Math.floor((diff % 3600) / 60));
    this.seconds.set(diff % 60);
  }

  private padZero(num: number): string {
    if (num >= 100) {
      return '+99';
    }
    return num.toString().padStart(2, '0');
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
