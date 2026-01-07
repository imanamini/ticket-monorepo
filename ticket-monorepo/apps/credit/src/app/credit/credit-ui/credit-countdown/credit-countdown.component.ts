import { Component, input, model, OnInit, output } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-credit-countdown',
  templateUrl: './credit-countdown.component.html',
  styleUrls: ['./credit-countdown.component.scss']
})
export class CreditCountdownComponent implements OnInit {

  timeInSeconds = model<number>(3600 * 12);

  type = input<'installment' | 'mm:ss'>('installment');

  timeoutSubscription: Subscription;

  finished = output<boolean>();

  constructor() {
  }

  /**
   *
   */
  get formattedTime() {
    const seconds = Number(this.timeInSeconds());

    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor(seconds % (3600 * 24) / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    const s = Math.floor(seconds % 60);

    return {
      day: this.pan(d),
      hour: this.pan(h),
      minutes: this.pan(m),
      seconds: this.pan(s),
    };
  }

  ngOnInit() {
    this.timeoutSubscription = interval(1000).subscribe(() => {
      if (this.timeInSeconds() > 0) {
        this.timeInSeconds.update(time => time - 1);
      } else {
        this.finished.emit(true);
        this.timeoutSubscription.unsubscribe();
      }
    });
  }

  private pan(value: number): string {
    if (value < 10) {
      // @ts-ignore
      value = '0' + String(value);
    }

    return String(value);
  }

}
