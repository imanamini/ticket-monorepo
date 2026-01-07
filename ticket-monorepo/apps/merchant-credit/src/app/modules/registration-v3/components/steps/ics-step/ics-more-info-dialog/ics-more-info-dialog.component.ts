import { Component, OnInit } from '@angular/core';
import { SmartDialog } from '../../../../../../user-interface/services/smart-dialog';

@Component({
  selector: 'ics-more-info-dialog',
  templateUrl: './ics-more-info-dialog.component.html',
  styleUrls: ['./ics-more-info-dialog.component.scss']
})
export class IcsMoreInfoDialogComponent implements OnInit {
  points: string[] = [
    'خوش‌حسابی در بازپرداخت تسهیلات بانکی',
    'خوش‌حسابی حساب جاری (دسته‌چک) ',
    'سابقۀ فعال در دریافت تسهیلات و تراکنش‌های بانکی'
  ];

  constructor(private smartDialog: SmartDialog) {
  }

  ngOnInit(): void {
  }

  onClose() {
    this.smartDialog.close();
  }
}
