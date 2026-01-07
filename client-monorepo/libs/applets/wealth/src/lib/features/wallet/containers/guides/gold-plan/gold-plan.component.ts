import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { AppBarWrapperComponent } from 'libs/applets/wealth/src/lib/components/core/components/app-bar-wrapper/app-bar-wrapper.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ISteps } from '../../../models/deposit-hint.interface';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { WALLETS_ROUTE } from 'libs/applets/wealth/src/lib/data-access/constants/app-routes';

@Component({
  selector: 'wealth-applet-gold-plan',
  standalone: true,
  imports: [CommonModule, AppBarWrapperComponent],
  templateUrl: './gold-plan.component.html',
  styleUrl: './gold-plan.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoldPlanComponent implements OnInit {
  private navigationService = inject(WealthNavigationService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  walletId = signal<string | undefined>(undefined);
  notes = signal<ISteps[]>([
    {
      parts: [
        {
          type: 'text',
          value:
            'در طرح طلا می‌توانید ۷ روز هفته به صورت ۲۴ ساعته حتی در روز‌های تعطیل، بدون ریسک نگهداری و تقلبی بودن، بر مبنای شمش طلای ۲۴ عیار سرمایه‌گذاری ‌کنید.',
        },
      ],
    },
    {
      parts: [
        {
          type: 'text',
          value: ' در این طرح تغییر ارزش دارایی‌تان با نوسانات قیمت طلا اتفاق می‌افتد.',
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
          value: 'حداقل مبلغ خرید ۱ میلیون تومان است.',
        },
      ],
    },
    {
      parts: [
        {
          type: 'text',
          value: 'خرید این طرح بدون کارمزد و فروش آن با کارمزد ۱٪ است.',
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
          value: 'در این طرح می‌توانید به اندازه ۶۰٪ از کل موجودی خود اعتبار 4 قسطه دریافت کنید اما، کل موجودی‌ طرح مسدود خواهد شد.',
        },
      ],
    },
    {
      parts: [
        {
          type: 'text',
          value: 'قیمت خرید و فروش حتی در روزهای تعطیل، بر اساس قیمت جهانی انس طلا و نرخ دلار به روزرسانی می‌شوند.',
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
