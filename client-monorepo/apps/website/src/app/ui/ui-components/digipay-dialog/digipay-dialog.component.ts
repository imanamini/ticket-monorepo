import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { UiSpinnerComponent } from '../ui-loading/ui-spinner/ui-spinner.component';
import { MatButton } from '@angular/material/button';
import { NgIf, NgClass } from '@angular/common';
import { MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';

@Component({
  selector: 'app-digipay-dialog',
  templateUrl: './digipay-dialog.component.html',
  styleUrls: ['./digipay-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, NgIf, MatButton, UiSpinnerComponent, NgClass],
})
export class DigipayDialogComponent {
  @Input()
  title: string;

  @Input()
  confirmText: string;

  @Input()
  rejectText: string;

  @Input()
  rejectClass: string;

  @Input()
  alignActions: 'start' | 'end' | 'center' = 'start';

  @Output()
  emitClose: EventEmitter<boolean> = new EventEmitter();

  @Input()
  confirmSpinner = false;

  @Input()
  disableConfirm = false;
  confirmButtonClick() {
    if (this.emitClose) {
      this.emitClose.emit(true);
    }
  }

  rejectClick() {
    if (this.emitClose) {
      this.emitClose.emit(false);
    }
  }
}
