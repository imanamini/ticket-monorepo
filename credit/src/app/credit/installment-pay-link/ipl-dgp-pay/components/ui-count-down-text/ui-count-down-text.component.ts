import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { interval, Subscription } from 'rxjs';

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

  constructor(
    private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.timeoutSubscription = interval(1000).subscribe(() => {
      if (this.seconds > 0) {
        this.seconds--;
      } else {
        this.finished.emit(true);
        this.timeoutSubscription.unsubscribe();
      }
      this.changeDetectorRef.detectChanges();
    });
  }

  private pan(value: number): string {
    if (value < 10) {
      // @ts-ignore
      value = '0' + String(value);
    }

    return String(value);
  }

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

}
