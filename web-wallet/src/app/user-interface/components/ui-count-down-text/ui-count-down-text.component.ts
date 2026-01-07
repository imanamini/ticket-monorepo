import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { TimerInterface } from './timer.interface';

@Component({
  selector: 'ui-count-down-text',
  templateUrl: './ui-count-down-text.component.html',
  styleUrls: ['./ui-count-down-text.component.scss']
})
export class UiCountDownTextComponent implements OnInit {

  @Input()
  seconds: number;

  @Output()
  finished = new EventEmitter<boolean>();

  timeoutSubscription: Subscription;

  @Input()
  showParentheses = false;

  timer: BehaviorSubject<TimerInterface> = new BehaviorSubject<TimerInterface>(null);

  private static pan(value: number | string): string {
    if ((value as number) < 10) {
      value = '0' + String(value);
    }
    return String(value);
  }

  ngOnInit() {
    this.formattedTime();
    this.intervalTimer();
  }

  private intervalTimer(): void {
    this.timeoutSubscription = interval(1000).subscribe(() => {
      if (this.seconds > 0) {
        this.decreaseSecond();
        this.formattedTime();
      } else {
        this.finished.emit(true);
        this.timeoutSubscription.unsubscribe();
      }
    });
  }

  private decreaseSecond(): void {
    this.seconds--;
  }

  private formattedTime() {
    const seconds = Number(this.seconds);
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    this.timer.next({
      minutes: UiCountDownTextComponent.pan(m),
      seconds: UiCountDownTextComponent.pan(s),
    });
  }
}
