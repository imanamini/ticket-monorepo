import { Component, inject } from '@angular/core';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { NgIf } from '@angular/common';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { SmartDialog } from '../../../../../../../../../../user-interface/services/smart-dialog';

@Component({
  selector: 'es-loan-registration-ics-reporting-more-info-dialog',
  standalone: true,
  imports: [
    NgxCalloutComponent,
    NgIf,
    NgxButtonComponent
  ],
  templateUrl: './es-loan-registration-ics-reporting-more-info-dialog.component.html',
  styleUrl: './es-loan-registration-ics-reporting-more-info-dialog.component.scss'
})
export class EsLoanRegistrationIcsReportingMoreInfoDialogComponent {
  smartDialog = inject(SmartDialog);

  onClose() {
    this.smartDialog.close();
  }
}
