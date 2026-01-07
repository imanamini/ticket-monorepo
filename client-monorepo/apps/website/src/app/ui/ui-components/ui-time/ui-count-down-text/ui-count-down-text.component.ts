import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-ui-count-down-text',
  templateUrl: './ui-count-down-text.component.html',
  styleUrls: ['./ui-count-down-text.component.scss'],
  standalone: true,
  imports: [NgIf],
})
export class UiCountDownTextComponent implements OnInit {
  @Input()
  seconds: number;

  @Output()
  finished = new EventEmitter<boolean>();

  timeoutSubscription: Subscription;

  @Input()
  showParentheses = false;

  /**
   *
   */
  get formattedTime() {
    const seconds = Number(this.seconds);

    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);

    return {
      minutes: this.pan(m),
      seconds: this.pan(s),
    };
  }

  ngOnInit() {
    this.timeoutSubscription = interval(1000).subscribe(() => {
      if (this.seconds > 0) {
        this.seconds--;
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
