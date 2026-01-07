import { Component, inject, OnInit } from '@angular/core';
import { SmartDialog } from '../../../../../../../../../../user-interface/services/smart-dialog';

@Component({
  selector: 'es-loan-saman-ics-more-info-dialog',
  templateUrl: './es-loan-saman-ics-more-info-dialog.component.html',
  styleUrls: ['./es-loan-saman-ics-more-info-dialog.component.scss']
})
export class EsLoanSamanIcsMoreInfoDialogComponent {
  points: string[] = [
    'خوش‌حسابی در بازپرداخت تسهیلات بانکی',
    'خوش‌حسابی حساب جاری (دسته‌چک) ',
    'سابقۀ فعال در دریافت تسهیلات و تراکنش‌های بانکی'
  ];

  smartDialog = inject(SmartDialog);

  onClose() {
    this.smartDialog.close();
  }
}
