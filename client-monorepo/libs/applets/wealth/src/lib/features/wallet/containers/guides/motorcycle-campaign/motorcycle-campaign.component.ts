import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { ISteps } from '../../../models/deposit-hint.interface';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { WALLETS_ROUTE } from 'libs/applets/wealth/src/lib/data-access/constants/app-routes';
import { AppBarWrapperComponent } from 'libs/applets/wealth/src/lib/components/core/components/app-bar-wrapper/app-bar-wrapper.component';

@Component({
  selector: 'wealth-applet-motorcycle-campaign',
  standalone: true,
  imports: [CommonModule, AppBarWrapperComponent, NgxButtonComponent],
  templateUrl: './motorcycle-campaign.component.html',
  styleUrl: './motorcycle-campaign.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MotorcycleCampaignComponent implements OnInit {
  private navigationService = inject(WealthNavigationService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  walletId = signal<string | undefined>(undefined);
  wealthWalletNotes = signal<ISteps[]>([
    {
      parts: [
        {
          type: 'text',
          value:
            'تمام کاربرانی که در بازه‌ی کمپین حداقل یک واریز موفق به کیف ثروت داشته باشند، به صورت خودکار در این قرعه‌کشی شرکت داده می شوند.',
        },
      ],
    },
    {
      parts: [
        {
          type: 'text',
          value: 'به ازای هر ۱۰ میلیون تومان موجودی روزانه در کیف ثروت، ۱ امتیاز محاسبه می شود.',
        },
      ],
    },
    {
      parts: [
        {
          type: 'text',
          value: 'مجموع دارایی شما در هر دو طرح طلا و درآمد ثابت مبنای محاسبه امتیاز خواهد بود.',
        },
      ],
    },
  ]);

  bnplNotes = signal<ISteps[]>([
    {
      parts: [
        {
          type: 'text',
          value:
            'کاربرانی که علاوه بر سرمایه‌گذاری، از اعتبار کیف ثروت برای خرید استفاده کنند، در یک قرعه‌کشی جداگانه نیز شرکت داده می شوند.',
        },
      ],
    },
    {
      parts: [
        {
          type: 'text',
          value: 'به ازای هر ۱۰ میلیون تومان استفاده از اعتبار، ۱ امتیاز اضافی دریافت می کنید.',
        },
      ],
    },
    {
      parts: [
        {
          type: 'text',
          value: 'این گروه از کاربران، به دلیل حضور در هر دو قرعه‌کشی، شانس برنده شدن بالاتری خواهند داشت.',
        },
      ],
    },
    {
      parts: [
        {
          type: 'text',
          value: 'در صورت مرجوع شدن کالا، امتیاز مربوط به آن خرید از کاربر کسر خواهد شد.',
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

  onStartInvesting() {
    this.navigationService.navigate([WALLETS_ROUTE, this.walletId()]);
  }
}
