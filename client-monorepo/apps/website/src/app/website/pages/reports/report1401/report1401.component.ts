import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';

import * as countUp from './count-up.js';
import { isPlatformBrowser, NgFor, NgOptimizedImage } from '@angular/common';
import { UiButtonComponent } from '../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { BaseLayoutComponent } from '../../../layout/base-layout/base-layout.component';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-report1401',
  templateUrl: './report1401.component.html',
  styleUrls: ['./report1401.component.scss'],
  standalone: true,
  imports: [BaseLayoutComponent, UiButtonComponent, NgFor, NgOptimizedImage],
})
export class Report1401Component implements OnInit {
  firstLookData: {
    title: string;
    description: string;
    icon: string;
  }[] = [
    {
      title: 'متوسط تعداد تراکنش‌های ماهانه در سوپر اپلیکیشن',
      description: 'یک میلیون و 3000 هزار تراکنش',
      icon: 'assets/report-1401/images/1.svg',
    },
    {
      title: 'متوسط تعداد تراکنش‌ها ماهانه در درگاه یکپارچه پرداخت',
      description: '4 میلیون و 300 هزار تراکنش',
      icon: 'assets/report-1401/images/2.svg',
    },
    {
      title: 'تعداد اعتبارهای خرد اعطا شده*',
      description: '۲+ میلیون و ۳۰۰ هزار اعتبار',
      icon: 'assets/report-1401/images/3.svg',
    },
    {
      title: 'مبلغ اعتبارهای خرد اعطا شده*',
      description: '۲.۲ هزار میلیارد',
      icon: 'assets/report-1401/images/4.svg',
    },
    {
      title: 'تعداد اعتبارهای BNPL اعطا شده در سال',
      description: '۲ میلیون اعتبار به ۶۱۰ هزار کاربر یکتا',
      icon: 'assets/report-1401/images/5.svg',
    },
    {
      title: 'مبلغ کل اعتبارهای  BNPL  اعطا شده در سال',
      description: 'یک هزار میلیارد',
      icon: 'assets/report-1401/images/6.svg',
    },
    {
      title: 'مبلغ تراکنش‌های موفق بر بستر کیف پول دیجی‌پی',
      description: '۱.۵ هزار میلیارد',
      icon: 'assets/report-1401/images/7.svg',
    },
    {
      title: 'تعداد کل تراکنش‌های موفق بربستر کیف پول دیجی‌پی',
      description: '۱۰ میلیون و ۶۰۰ هزار تراکنش',
      icon: 'assets/report-1401/images/8.svg',
    },
    {
      title: 'تعداد بازدید از سایت و اپلیکیشن دیجی‌پی',
      description: '۶۰ میلیون بازدید (مجموع بازدیدهای کاربران از هردو پلتفرم)',
      icon: 'assets/report-1401/images/9.svg',
    },
    {
      title: 'تعداد نصب فعال',
      description: '۲ میلیون نصب فعال (آمار تجمیعی همه بازارهای معتبر)',
      icon: 'assets/report-1401/images/10.svg',
    },
  ];

  cashBackData: {
    title: string;
    description: string;
    icon: string;
  }[] = [
    {
      title: ' مبلغ کل تراکنش‌های پردازش شده در سوپراپلیکیشن دیجی‌پی',
      description: '۶.۲ هزار میلیارد',
      icon: 'assets/report-1401/images/11.svg',
    },
    {
      title: 'بالاترین تعداد تراکنش یک فرد در طول یک سال',
      description: '۴۷۹۲ تراکنش',
      icon: 'assets/report-1401/images/12.svg',
    },
    {
      title: 'مبلغ کل تراکنش‌های کارت به کارت',
      description: '۴.۱+  هزار میلیارد',
      icon: 'assets/report-1401/images/13.svg',
    },
    {
      title: 'مبلغ کل خرید شارژ',
      description: '۴۱.۶+ میلیارد تومان',
      icon: 'assets/report-1401/images/14.svg',
    },
    {
      title: 'مبلغ کل عوارض آزادراهی پرداخت شده',
      description: '۳.۷+  میلیارد تومان',
      icon: 'assets/report-1401/images/15.svg',
    },
    {
      title: 'مبلغ کل کرایه تاکسی پرداخت شده',
      description: '۱۲۸+ میلیارد تومان',
      icon: 'assets/report-1401/images/16.svg',
    },
    {
      title: 'مبلغ کل جرائم رانندگی پرداخت شده',
      description: '۱.۵+ میلیارد تومان',
      icon: 'assets/report-1401/images/17.svg',
    },
    {
      title: 'مبلغ کل تراکنش های نیکوکاری',
      description: '۴.۸+ میلیارد تومان',
      icon: 'assets/report-1401/images/18.svg',
    },
    {
      title: 'مبلغ کل تراکنش‌های پرداخت قبض',
      description: '۲۰۲+ میلیارد تومان',
      icon: 'assets/report-1401/images/19.svg',
    },
    {
      title: 'مبلغ کل تراکنش های خرید بسته اینترنت',
      description: '۳۵+ میلیارد تومان',
      icon: 'assets/report-1401/images/20.svg',
    },
  ];

  generalUserData: {
    title: string;
    icon: string;
  }[] = [
    {
      title: 'طبقه بندی سنی کاربران سوپراپلیکیشن',
      icon: 'assets/report-1401/images/persona2.png',
    },
    {
      title: 'تجهیزات مورد استفاده کاربران سوپراپلیکیشن',
      icon: 'assets/report-1401/images/pie chart.png',
    },
    {
      title: 'طبقه بندی  جنسیتی کاربران سوپراپلیکیشن',
      icon: 'assets/report-1401/images/gender.png',
    },
    {
      title: 'سیستم عامل های کاربران سوپراپلیکیشن',
      icon: 'assets/report-1401/images/Devices.png',
    },
  ];

  userFeedbackData: {
    title: string;
    items: string[];
  }[] = [
    {
      title: 'طبقه بندی سنی کاربران سوپراپلیکیشن',
      items: [
        'سرعت پایین و پیچیدگی فرایند ثبت‌نام تا مرحله پرداخت هزینه‌های زیرساخت',
        'اطلاعات ناکافی در میزان سود و مبلغ پیش‌پرداخت',
        'کیفیت پایین پشتیبانی',
        'کیفیت پایین راهنمای تکمیل مدارک/چک',
        'مشکلات استفاده از اعتبار در موارد مرجوعی/کنسلی',
      ],
    },
    {
      title: 'تجهیزات مورد استفاده کاربران سوپراپلیکیشن',
      items: [
        'بروز خطا و اختلال (تراکنش ناموفق، در دسترس نبودن سرویس و...)',
        'سرعت پایین انجام عملیات (تأخیر در تسویه قبوض، دریافت رمز دوم و...)',
        'کیفیت پایین پشتیبانی',
        'مشکلات مربوط به کیف پول',
        'راحت نبودن استفاده/ظاهر اپلیکیشن',
      ],
    },
  ];

  generalCreditData: {
    title: string;
    description: string;
  }[] = [
    {
      title: 'تعداد درخواست های ثبت شده برای خدمات اعتباری',
      description: 'بیــــــش از ۲ میلیون',
    },
    {
      title: 'مبلغ درخواست‌های ثبت شده برای خدمات اعتباری',
      description: 'بیش از ۳۰ هزارمیلیارد',
    },
    {
      title: 'مبلغ اعتبارهای خرد اختصاص یافته به کاربران',
      description: '۱.۲ هزار میلیارد',
    },
  ];

  bnplGeneralData1: {
    title: string;
    description: string;
    icon: string;
  }[] = [
    {
      title: 'تعدادکاربران دریافت کننده',
      description: 'بیش از ۲ میلیون اعتبار به ۶۱۰ هزار کاربر یکتا',
      icon: 'assets/report-1401/images/users.svg',
    },
    {
      title: 'مبلغ اعتبارهای اعطا شده BNPL',
      description: 'یک هزار میلیارد',
      icon: 'assets/report-1401/images/credits.svg',
    },
  ];

  bnplGeneralData2: {
    title: string;
    icon: string;
  }[] = [
    {
      title: 'محبوب ترین کالای خریداری شده با BNPL',
      icon: 'assets/report-1401/images/airpods.svg',
    },
    {
      title: 'آقایان علاقه بیشتری به خرید اعتباری دارند',
      icon: 'assets/report-1401/images/chart7.svg',
    },
    {
      title: 'طبقه بندی سنی کاربران BNPL',
      icon: 'assets/report-1401/images/Persona-min.png',
    },
    {
      title: 'محبوب ترین کالا های خریداری شده با BNPL',
      icon: 'assets/report-1401/images/Products.png',
    },
  ];

  upgData: {
    title: string;
    description: string;
  }[] = [
    {
      title: 'تعداد تراکنش‌های موفق درگاه یکپارچه پرداخت دیجی پی',
      description: '۵۲+ میلیون',
    },
    {
      title: 'تعداد تراکنش‌های موفق بربستر کیف پول',
      description: '۱۰+ میلیون تراکنش',
    },
    {
      title: 'مبلغ کل تراکنش های موفق بربستر کیف پول',
      description: '۱.۵هزارمیلیارد',
    },
    {
      title: 'تعداد تراکنش‌های موفق واریز به کیف پول',
      description: '۱.۸ میلیون',
    },
    {
      title: 'مبلغ تراکنش‌های موفق واریز به کیف پول',
      description: '۴۰۰+ میلیارد تومان',
    },
    {
      title: 'تعداد تراکنش‌های موفق برداشت از کیف پول به حساب بانکی',
      description: '۱+ میلیون تراکنش',
    },
    {
      title: 'مبلغ کل تراکنش های موفق برداشت از کیف پول به حساب بانکی',
      description: ' ۳۴۳ میلیارد تومان',
    },
    {
      title: 'تعداد کل تراکنش های موفق کیف  به کیف',
      description: '۱۳۱+ هزار',
    },
    {
      title: 'مبلغ کل تراکنش های موفق کیف به کیف',
      description: '۹+میلیارد تومان',
    },
  ];
  wealthData: {
    title: string;
    description: string;
  }[] = [
    {
      title: 'تعداد مشاوره های سبدگردان',
      description: '۶۶۷',
    },
    {
      title: 'تعداد کاربران سنجش ریسک',
      description: '۲۹،۰۳۰',
    },
    {
      title: 'تعداد تراکنش های انجام شده',
      description: '+۱۴،۹۸۰',
    },
    {
      title: 'تعداد کاربران',
      description: '۷۰،۱۶۱',
    },
    {
      title: 'تعداد درخواست های مشاوره',
      description: '۲۵،۴۷۴',
    },
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: string) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      of('')
        .pipe(delay(1000))
        .subscribe({
          next: () => {
            new countUp.runCount();
          },
        });
    }
  }

  toggleCollapse(id: string) {
    if (isPlatformBrowser(this.platformId)) {
      const element = document.getElementById(id);
      const headerOffset = 200;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      const expand = document.getElementById(id).classList.contains('expand');
      if (!expand) {
        document.getElementById(id).classList.add('expand');
        document.getElementById(id + '-btn').innerText = '- کمتر';
      } else {
        document.getElementById(id).classList.remove('expand');
        document.getElementById(id + '-btn').innerText = '+ بیشتر';
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }
  }
}
