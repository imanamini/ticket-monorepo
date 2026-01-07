import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { AppBarWrapperComponent } from 'libs/applets/wealth/src/lib/components/core/components/app-bar-wrapper/app-bar-wrapper.component';
import { ISteps } from '../../../models/deposit-hint.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { WALLETS_ROUTE } from 'libs/applets/wealth/src/lib/data-access/constants/app-routes';

@Component({
  selector: 'wealth-applet-fixed-income',
  standalone: true,
  imports: [CommonModule, AppBarWrapperComponent],
  templateUrl: './fixed-income.component.html',
  styleUrl: './fixed-income.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FixedIncomeComponent implements OnInit {
  private navigationService = inject(WealthNavigationService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  walletId = signal<string | undefined>(undefined);
  notes = signal<ISteps[]>([
    {
      parts: [
        {
          type: 'text',
          value: 'در طرح درامد ثابت می‌توانید ۷ روز هفته به صورت ۲۴ ساعته حتی در روز‌های تعطیل سرمایه‌گذاری و',
        },
        {
          type: 'boldText',
          value: ' 30٪ ',
        },
        {
          type: 'text',
          value: 'سود موثر سالانه به صورت روز شمار دریافت کنید.',
        },
      ],
    },
    {
      parts: [
        {
          type: 'text',
          value: 'سرمایه‌گذاری در این طرح از طریق شرکت بیمه زندگی کاریزما انجام می‌شود. فعالیت این شرکت تحت نظر بیمه مرکزی است.',
        },
      ],
    },
    {
      parts: [
        {
          type: 'text',
          value: 'این طرح معاف از مالیات است.',
        },
      ],
    },
    {
      parts: [
        {
          type: 'text',
          value: 'خرید و فروش در این طرح بدون کارمزد است.',
        },
      ],
    },
    {
      parts: [
        {
          type: 'text',
          value: 'حداقل مبلغ خرید ۱ میلیون تومان است.',
        },
      ],
    },
    {
      parts: [
        {
          type: 'text',
          value: 'میزان فروش در این طرح محدودیت ندارد و ',
        },
        {
          type: 'boldText',
          value: 'حداکثر ۱ روز کاری ',
        },
        {
          type: 'text',
          value: 'بعد از ثبت درخواست انجام خواهد شد.',
        },
      ],
    },
    {
      parts: [
        {
          type: 'text',
          value:
            'در این طرح می‌توانید با مسدود سازی موجودی معادل ۱۰۰٪ آن اعتبار ۴ قسطه بدون کارمزد دریافت کنید. به موجودی مسدود شده در این طرح نیز سود تعلق می‌گیرد.',
        },
      ],
    },
  ]);

  ngOnInit(): void {
    this.walletId.set(this.activatedRoute.snapshot.paramMap.get('id'));
    const layout = document.getElementById('dpx-main-layout-body');
    if (layout) {
      layout.scrollTo(0, 0);
    }
  }

  onBackHandler() {
    this.navigationService.navigate([WALLETS_ROUTE, this.walletId()]);
  }

  handleClick(link: string) {
    this.router.navigateByUrl(link);
  }
}
