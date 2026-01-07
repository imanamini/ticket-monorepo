import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { WALLETS_ROUTE } from '../../../../../data-access/constants/app-routes';
import { ActivatedRoute } from '@angular/router';
import { NgxSegmentedControlComponent } from '@digipay/ngx-segmented-control';
import { SegmentItemsModel } from '@digipay/ngx-segmented-control/lib/models/types';
import { IGuidStep } from '../../../models/credit-guids-step.interface';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { CreditGuidSteperComponent } from '../../../components/credit-guid-steper/credit-guid-steper.component';

@Component({
  selector: 'wealth-applet-profit-credit',
  standalone: true,
  imports: [CommonModule, NgxSegmentedControlComponent, NgxAppBarComponent, CreditGuidSteperComponent],
  templateUrl: './profit-credit.component.html',
  styleUrl: './profit-credit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfitCreditComponent {
  title = signal<string>('راهنمای دریافت سود و اعتبار');
  getProfit = signal<boolean>(false);

  private activatedRouter = inject(ActivatedRoute);
  private navigationService = inject(WealthNavigationService);

  definitionItems = signal<IGuidStep[]>([
    {
      title: 'اعتبار اقساطی چیست؟',
      descriptions:
        'اعتبار اقساطی، مبلغی است که بدون نیاز به چک، سفته یا ضامن دریافت می‌کنید و می‌توانید با استفاده از آن از فروشگاه‌های طرف قرارداد دیجی‌پی، به‌صورت آنلاین یا حضوری،  خرید و هزینه را در ۴ قسط پرداخت کنید.',
      image: './wealth-assets/images/guids/payment-method.png',
    },
    {
      title: 'نحوه استفاده',
      descriptions:
        'بعد از دریافت اعتباراقساطی، در زمان خرید آنلاین (سایت فروشگاه) یا حضوری (با استفاده از بارکد موجود در فروشگاه)،  موقع پرداخت، گزینه پرداخت اعتباری ۴ قسطه را انتخاب کنید. توجه داشته باشید که قسط اول را باید زمان خرید پرداخت کنید.',
      image: './wealth-assets/images/guids/installment-list.png',
    },
    {
      title: 'پرداخت اقساط',
      descriptions: `فرصت پرداخت هر قسط، از یکم تا پنجم هر ماه است.
در صورت عدم پرداخت، مبلغ قسط از موجودی کیف ثروت کسر خواهد شد.`,
    },
  ]);

  profitItems = signal<IGuidStep[]>([
    {
      title: 'دریافت سود و اعتبار بدون کارمزد',
      descriptions:
        'با درخواست اعتبار می‌توانید با مسدود سازی موجودی، علاوه بر دریافت اعتبار خرید ۴ قسطه، روی کل موجودی خود (مسدود شده و قابل برداشت) سود دریافت کنید.در این روش، واریز مبلغ و درخواست اعتبار همزمان انجام می‌شود.',
      image: './wealth-assets/images/guids/cashin-wallet.png',
    },
    {
      title: 'دریافت سود به تنهایی',
      descriptions:
        'اگر تنها به دریافت سود علاقه مند هستید، می توانید با واریز مبلغ دلخواه به کیف ثروت خود، از سود موثر سالانه ۲۰٪  به صورت روزشمار بهره مند شوید. حداقل مبلغ واریز برای اولین بار، ۵ میلیون تومان است. سرمایه گذاری شما یک روز بعد از واریز مشمول سود شده و این سود دو روز بعد به موجودیتان اضافه خواهد شد.',
    },
  ]);

  options = signal<SegmentItemsModel[]>([
    { text: 'تعریف اعتبار اقساطی', id: 'definition', value: 1 },
    { text: 'دریافت سود و اعتبار', id: 'profit', value: 2 },
  ]);

  onBackHandler() {
    const walletId = this.activatedRouter.snapshot.paramMap.get('id');
    const referrer = this.activatedRouter.snapshot.queryParams['referrer'];
    this.navigationService.navigate([WALLETS_ROUTE, walletId], {
      queryParams: {
        referrer,
      },
    });
  }

  handleActiveSection(buttonLabel: SegmentItemsModel) {
    buttonLabel.id === 'profit' ? this.getProfit.set(true) : this.getProfit.set(false);
  }
}
