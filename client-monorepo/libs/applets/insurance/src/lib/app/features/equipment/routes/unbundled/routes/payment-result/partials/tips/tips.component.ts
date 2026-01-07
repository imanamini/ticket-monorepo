import { Component, Input, OnInit } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { PaymentResultModel } from '../../../../../../api/models/lead/payment-result.model';

@Component({
  selector: 'app-tips',
  templateUrl: './tips.component.html',
  styleUrls: ['./tips.component.scss'],
  imports: [
    NgIf,
    NgForOf
  ],
  standalone: true
})
export class TipsComponent implements OnInit {

  @Input()
  result: PaymentResultModel;

  drawerOpened = true;

  presentDocumentListOne = [
    'دستگاه معیوب به همراه جعبه.',
    'اصل کارت گارانتی (در صورتی که دستگاه داری گارانتی است).',
    'سایر تجهیزات جانبی لازم به مانند شارژر'
  ];

  presentDocumentListTwo = [
    'اعلام سرقت اولیه به پلیس.',
    'اصل گزارش تایید مراجع قضایی و انتظامی مرتبط با شکست حرز.',
    'مدارک و مستندات پرونده تشکیل شده در دادسرا؛',
    'پرینت استعلام ثبت سرقت در سامانه همیاب',
    'استعلام عدم کشف از آگاهی پس از 30 روز از تاریخ اعلام سرقت؛',
  ];

  constructor() {
  }

  ngOnInit(): void {
  }

}
