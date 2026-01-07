import { Component, inject, OnInit } from '@angular/core';
import { SmartDialog } from '../../../user-interface/services/smart-dialog';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'es-loan-terms-dialog',
  standalone: true,
  imports: [
    NgxButtonComponent

  ],
  templateUrl: './es-loan-terms-dialog.component.html',
  styleUrls: ['./es-loan-terms-dialog.component.scss']
})
export class EsLoanTermsDialogComponent {
  smartDialog = inject(SmartDialog);

  closeButton() {
    this.smartDialog.close({confirmed: true});
  }

}
