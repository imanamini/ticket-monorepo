import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bnpl-landing-guide-section',
  templateUrl: './bnpl-landing-guide-section.component.html',
  styleUrls: ['./bnpl-landing-guide-section.component.scss']
})
export class BnplLandingGuideSectionComponent implements OnInit {
  title = 'در نظر داشته باشید';

  boxList: { title: string, description: string, open: boolean }[] = [
    {
      title: 'مهلت استفاده از اعتبار',
      description: 'از زمان دریافت اعتبار، تا تاریخ انقضای درج شده روی کارت اعتبارتان فرصت استفاده از اعتبار را دارید.',
      open: true,
    },
    {
      title: 'شروع بازپرداخت',
      description: 'پس از دریافت اعتبار، روز یکم ماه بعد شروع بازپرداخت بدهی شماست.',
      open: true,
    },
    {
      title: 'تاخیر در بازپرداخت',
      description: 'پنج روز پس از سررسید بدهی، جریمه به صورت روزشمار به مبلغ بدهی شما اضافه خواهد شد. افزون بر این،‌ تداوم بدحسابی، به تاثیر منفی روی رتبه‌ی اعتباری شما نزد بانک مرکزی منجر خواهد شد.',
      open: true,
    },
    {
      title: 'شارژ مجدد اعتبار',
      description: 'در صورت خوش حسابی (پرداخت به موقع بدهی)، بعد از تسویه هر بدهی، اعتبارتان بلافاصله شارژ شده و می‌توانید دوباره خرید کنید.',
      open: true
    },
  ];

  constructor() {
  }

  ngOnInit() {
  }

  openItemFaq(box: any) {
    box.open = !box.open;
  }

}
