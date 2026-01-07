import { ChangeDetectorRef, Component, inject, Input, OnInit, OnDestroy, signal } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'health-check-timer',
  templateUrl: './health-check-timer.component.html',
  standalone: true,
  styleUrls: ['./health-check-timer.component.scss']
})
export class HealthCheckTimerComponent implements OnInit, OnDestroy {
  private cdr = inject(ChangeDetectorRef);

  @Input()
  timeMinute: number;

  currentTime = signal<number>(0);
  private timerSubscription: Subscription = new Subscription();

  ngOnInit(): void {
    if (this.timeMinute) {
      this.startTimer();
    }
  }

  startTimer(): void {
    this.currentTime.set(this.timeMinute * 60);

    this.timerSubscription.add(interval(1000).pipe(
      takeWhile(() => this.currentTime() > 0)
    ).subscribe(() => {
      this.currentTime.update(time => time - 1);
      this.cdr.markForCheck();

      if (this.currentTime() === 0) {
        this.stopTimer();
      }
    }));
  }

  stopTimer(): void {
    this.timerSubscription.unsubscribe();
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }
}
