import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AnalyticsId } from '../../../api/models/analytics-id';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'ui-dialog',
  templateUrl: './ui-dialog.component.html',
  styleUrls: ['./ui-dialog.component.scss']
})
export class UiDialogComponent {
  @Input()
  id: AnalyticsId;

  @Input()
  fullWidthSubmitButton = false;

  @Input()
  title: string;

  @Input()
  confirmText: string;

  @Input()
  rejectText: string;

  @Input()
  rejectButtonTitle = 'انصراف';

  @Input()
  hasRejectButtonTitle = true;

  @Input()
  submitButtonTitle = 'تایید';

  @Input()
  theme: 'default' | 'digipay' | 'secondary' | 'thin-dialog' = 'default';

  @Input()
  disableSubmitButton = false;

  @Input()
  disableRejectButton = false;

  @Input()
  hasCloseButton = false;

  @Input()
  hasBackButton = false;

  @Output()
  close: EventEmitter<boolean> = new EventEmitter();

  @Output()
  submit = new EventEmitter();

  constructor(
    private dialog: MatDialog,
  ) {
  }

  closeIcon() {
    this.dialog.closeAll();
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

  submitAction() {
    this.submit.emit();
  }
}
