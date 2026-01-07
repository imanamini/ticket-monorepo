import { Component } from '@angular/core';

@Component({
  selector: 'subscription-applet-refund-cap-table',
  templateUrl: './refund-cap-table.component.html',
  standalone: true,
  styleUrls: ['./refund-cap-table.component.scss'],
})
export class RefundCapTableComponent {
  CAPS = [
    { title: 'محدودیت روزانه', times: '1', unit: '۲۴ ساعت' },
    { title: 'محدودیت هفتگی', times: '2', unit: 'هفته' },
    { title: 'محدودیت ماهانه', times: '5', unit: 'ماه' },
  ];
}
