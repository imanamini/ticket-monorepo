import { ChangeDetectionStrategy, Component, input, output, signal, ViewEncapsulation } from '@angular/core';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'app-credit-digipay-dialog',
  templateUrl: './credit-digipay-dialog.component.html',
  styleUrls: ['./credit-digipay-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [NgxButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditDigipayDialogComponent {
  title = input<string>();

  confirmText = input<string>();

  rejectText = input<string>();

  close = output<boolean>();

  confirmSpinner = signal(false);

  disableConfirm = input<boolean>(false);

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
