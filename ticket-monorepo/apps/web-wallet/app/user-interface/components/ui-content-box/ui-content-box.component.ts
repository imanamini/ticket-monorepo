import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ui-content-box',
  templateUrl: './ui-content-box.component.html',
  styleUrls: ['./ui-content-box.component.scss']
})
export class UiContentBoxComponent {

  @Input()
  showHeader = false;

  @Input()
  showLogo = false;

  @Input()
  showTitleLogo = false;

  @Input()
  title: string;

  @Input()
  showCountDown = false;

  @Input()
  countDownSeconds = 0;

  @Input()
  smallMode = false;

  @Output()
  countDownFinished = new EventEmitter<any>();

  emitCountDownFinish() {
    this.countDownFinished.emit(true);
  }
}
