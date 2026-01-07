import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ui-digipay-dialog',
  templateUrl: './digipay-dialog.component.html',
  styleUrls: ['./digipay-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DigipayDialogComponent implements OnInit {

  @Input()
  title: string;

  @Input()
  confirmText: string;

  @Input()
  rejectText: string;

  @Output()
  close: EventEmitter<boolean> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  confirmButtonClick() {
    if (this.close) {
      this.close.emit(true);
    }
  }

  rejectClick() {
    if (this.close) {
      this.close.emit(false);
    }
  }
}
