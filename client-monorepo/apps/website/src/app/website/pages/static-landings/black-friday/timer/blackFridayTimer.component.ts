import {
  ChangeDetectionStrategy,
  Component,
  effect,
  Inject,
  input,
  OnDestroy, OnInit,
  PLATFORM_ID,
  signal
} from '@angular/core';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {Timer} from "../../../marketing-campaigns/monthly-sale/campaign-timer/campaign-timer.component";
import {interval, Subject, takeUntil, timer} from "rxjs";
import {map} from "rxjs/operators";
import {pad} from "lodash";

@Component({
  selector: 'app-black-friday-timer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blackFridayTimer.component.html',
  styleUrl: './blackFridayTimer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlackFridayTimerComponent implements OnDestroy {
  deadline = input<number>();

  timer = signal<Partial<Timer>>({
    days: '',
    hours: '',
    minutes: '',
    seconds: ''
  });


  private destroy$ = new Subject<void>();

  constructor(@Inject(PLATFORM_ID) private platformId: string) {
    if (isPlatformBrowser(this.platformId)) {
      effect(() => {
        this.startTimer();
      });
    }
  }

  private startTimer() {
    const deadline = new Date(this.deadline()).getTime();

    if (deadline) {
      timer(0, 1000)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          const now = new Date().getTime();
          const timeLeft = deadline - now;
          const pad = (num: number) => num.toString().padStart(2, '0');

          this.timer.set({
            days: pad(Math.floor(timeLeft / (1000 * 60 * 60 * 24))),
            hours: pad(Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))),
            minutes: pad(Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))),
            seconds: pad(Math.floor((timeLeft % (1000 * 60)) / 1000)),
          });
        });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }


}
