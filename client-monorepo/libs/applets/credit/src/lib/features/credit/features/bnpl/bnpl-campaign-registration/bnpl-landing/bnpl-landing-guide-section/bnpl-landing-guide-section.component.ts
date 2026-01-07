import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-bnpl-landing-guide-section',
  templateUrl: './bnpl-landing-guide-section.component.html',
  standalone: true,
  imports: [NgxIcon],
  styleUrls: ['./bnpl-landing-guide-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BnplLandingGuideSectionComponent {
  title = 'در نظر داشته باشید';

  boxList: { title: string; description: string; open: boolean }[] = [
    {
      title: 'مهلت استفاده از اعتبار اقساطی',
      description: 'از زمان دریافت اعتباراقساطی، تا تاریخ انقضای درج شده روی کارت اعتبارتان فرصت استفاده از اعتبار را دارید.',
      open: true,
    },
    {
      title: 'شروع بازپرداخت',
      description: 'پس از دریافت اعتبار اقساطی، روز یکم ماه بعد شروع بازپرداخت بدهی شماست.',
      open: true,
    },
    {
      title: 'تاخیر در بازپرداخت',
      description:
        'پنج روز پس از سررسید بدهی، جریمه به صورت روزشمار به مبلغ بدهی شما اضافه خواهد شد. افزون بر این،‌ تداوم بدحسابی، به تاثیر منفی روی رتبه‌ی اعتباری شما نزد بانک مرکزی منجر خواهد شد.',
      open: true,
    },
    {
      title: 'شارژ مجدد اعتبار اقساطی',
      description:
        'در صورت خوش حسابی (پرداخت به موقع بدهی)، بعد از تسویه هر بدهی، اعتبارتان بلافاصله شارژ شده و می‌توانید دوباره خرید کنید.',
      open: true,
    },
  ];

  openItemFaq(box: any) {
    box.open = !box.open;
  }
}
