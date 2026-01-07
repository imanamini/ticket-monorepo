import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'ui-error-request',
  templateUrl: './ui-error-request.component.html',
  styleUrls: ['./ui-error-request.component.scss']
})
export class UiErrorRequestComponent implements OnInit {
  @Input()
  id: string;

  @Input()
  errorMessage = '';

  @Input()
  defaultErrorMessage = 'خطا در دریافت اطلاعات!';

  @Input()
  buttonTitle = 'تلاش مجدد';

  @Input()
  hasButton = true;

  @Output()
  clicked = new EventEmitter();

  ngOnInit() {
    this.errorMessage = this.errorMessage || this.defaultErrorMessage;
  }

  retryClicked() {
    this.clicked.emit();
  }
}
