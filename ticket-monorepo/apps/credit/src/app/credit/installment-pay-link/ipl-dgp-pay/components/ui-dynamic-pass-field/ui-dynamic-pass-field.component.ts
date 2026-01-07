import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'ui-dynamic-pass-field',
  templateUrl: './ui-dynamic-pass-field.component.html',
  styleUrls: ['./ui-dynamic-pass-field.component.scss']
})
export class UiDynamicPassFieldComponent implements OnInit {

  @Input()
  enableSendButton = false;

  @Input()
  inProgress = false;

  @Input()
  countdownSeconds: number = null;

  @Input()
  value = '';

  @Output()
  sendButtonClicked = new EventEmitter();

  @Output()
  countdownFinished = new EventEmitter();

  @Output()
  inputFocusIn = new EventEmitter();

  @Input()
  validationRules: any[] = [];

  @Input()
  parentForm: UntypedFormGroup;

  @Input()
  controlName: string;

  @Input()
  autofocus: boolean;

  constructor() {
  }

  ngOnInit() {
  }

  onSend() {
    if (!this.enableSendButton) {
      return;
    }
    this.sendButtonClicked.emit();
  }

  onFinish() {
    this.countdownFinished.emit();
  }

  onFocusIn($event) {
    this.inputFocusIn.emit($event);
  }

}
