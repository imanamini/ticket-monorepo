import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { AppBarWrapperComponent } from 'libs/applets/wealth/src/lib/components/core/components/app-bar-wrapper/app-bar-wrapper.component';
import { ActivatedRoute, Router } from '@angular/router';
import { IParts, ISteps } from '../../../models/deposit-hint.interface';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { WALLETS_ROUTE } from 'libs/applets/wealth/src/lib/data-access/constants/app-routes';
import { BidiModule } from '@angular/cdk/bidi';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgxSegmentedControlComponent } from '@digipay/ngx-segmented-control';
import { CreditGuidSteperComponent } from '../../../components/credit-guid-steper/credit-guid-steper.component';
import { IGuidStep } from '../../../models/credit-guids-step.interface';
import { SegmentItemsModel } from '@digipay/ngx-segmented-control/lib/models/types';
import { IUserActivity } from 'libs/applets/wealth/src/lib/shared/services/activities/models/user-activities.interface';
import { UserActivitiesService } from 'libs/applets/wealth/src/lib/shared/services/activities/user-activities.service';

@Component({
  selector: 'wealth-applet-purchase-credit',
  standalone: true,
  imports: [CommonModule, AppBarWrapperComponent, BidiModule, NgxIcon, NgxSegmentedControlComponent, CreditGuidSteperComponent],
  templateUrl: './purchase-credit.component.html',
  styleUrl: './purchase-credit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchaseCreditComponent implements OnInit {
  private navigationService = inject(WealthNavigationService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private userActivityService = inject(UserActivitiesService);

  getProfit = signal<boolean>(false);
  definitionItems = signal<IGuidStep[]>([
    {
      title: 'اعتبار چیست؟',
      descriptions:
        'اعتبار، مبلغی است که بدون نیاز به چک، سفته یا ضامن دریافت می‌کنید و می‌توانید با استفاده از آن از فروشگاه‌های طرف قرارداد دیجی‌پی، به‌صورت آنلاین یا حضوری،  خرید و هزینه را در ۴ قسط پرداخت کنید.',
      image: './wealth-assets/images/guids/payment-method.png',
    },
    {
      title: 'نحوه استفاده',
      descriptions:
        'بعد از دریافت اعتبار، در زمان خرید آنلاین (سایت فروشگاه) یا حضوری ( با استفاده از بارکد موجود در فروشگاه )،  موقع پرداخت، گزینه پرداخت اعتباری را انتخاب کنید. توجه داشته باشید که قسط اول را باید زمان خرید پرداخت کنید.',
      image: './wealth-assets/images/guids/installment-list.png',
    },
    {
      title: 'پرداخت اقساط',
      descriptions: `فرصت پرداخت هر قسط، از یکم تا پنجم هر ماه است. در صورت عدم پرداخت ، مبلغ قسط از موجودی کیف ثروت (با اولویت طرح درامد ثابت) کسر خواهد شد.`,
    },
  ]);

  options = signal<SegmentItemsModel[]>([
    { text: 'تعریف اعتبار اقساطی', id: 'definition', value: 1 },
    { text: 'نکات مهم', id: 'profit', value: 2 },
  ]);

  supportNumber = signal<string>('021-53924000');
  walletId = signal<string | undefined>(undefined);
  source_url = encodeURIComponent('/mini-app/wealth/wallets/treasury');
  notes = signal<ISteps[]>([
    {
      parts: [
        {
          type: 'text',
          value: `شما می‌توانید به پشتوانه دارایی‌تان اعتبار ۴قسطه بدون کارمزد دریافت کنید. با درخواست اعتبار، موجودی شما متناسب با اعتبار دریافتی  تا زمان پرداخت اقساط، مسدود خواهد شد.`,
        },
        {
          type: 'text',
          value: `\nمقدار دریافت اعتبار در طرح درامد ثابت معادل ۱۰۰٪ موجودی است .به موجودی مسدود شده در این طرح نیز سود تعلق می‌گیرد.`,
        },
      ],
    },
    {
      parts: [
        {
          type: 'text',
          value: `در طرح طلا با توجه به ریسک نوسانات قیمت طلا، معادل ۶۰٪ موجودی ‌میتوانید اعتبار اقساطی دریافت کنید اما، کل موجودی‌ طرح مسدود خواهد شد.`,
        },
      ],
    },
    {
      parts: [
        {
          type: 'text',
          value: `امکان دریافت اعتبار به پشتوانه مجموع دارایی‌تان در هر دو طرح نیز وجود دارد.`,
        },
        {
          type: 'text',
          value: ` اگر اعتبار درخواستی، بیشتر از موجودیتان بود، می‌توانید موجودی خود را در فرایند درخواست اعتبار افزایش دهید. `,
        },
      ],
    },
    {
      parts: [
        {
          type: 'text',
          value: 'حداقل مبلغ درخواست اعتبار،',
        },
        {
          type: 'boldText',
          value: ' 5 میلیون تومان ',
        },
        {
          type: 'text',
          value: 'و حداکثر مبلغ',
        },
        {
          type: 'boldText',
          value: ' ۵۰۰ میلیون تومان ',
        },
        {
          type: 'text',
          value: 'است. اگر اعتبار فعال دارای بدهی دارید، ابتدا بدهی خود را از',
        },
        {
          type: 'link',
          value: ' اینجا ',
          link: `/service/credit/installments-overview?serviceType=bnpl&rfr=wlthug&${this.source_url}`,
          eventId: 'WW_GUlinkINS',
        },
        {
          type: 'text',
          value: 'پرداخت کنید. همچنین توجه داشته باشید که درخواست جدید باید بیشتر از',
        },
        {
          type: 'link',
          value: ' مبلغ اعتبار فعلی ',
          link: '/service/bnpl/overview?rfr=wlth',
          eventId: 'WW_GUlinkBNPL',
        },
        {
          type: 'text',
          value: 'باشد.',
        },
      ],
    },
    {
      parts: [
        {
          type: 'text',
          value: `هنگام دریافت اعتبار ترکیبی، ابتدا موجودی طرح درآمد ثابت مسدود و در صورت کافی نبودن موجودی آن، از طرح طلا برای تکمیل مسدود سازی استفاده می‌شود.
اگر موجودیتان در هر یک از دو طرح کافی نبود، می‌توانید در همین مرحله موجودیتان را افزایش دهید.`,
        },
      ],
    },
    {
      parts: [
        {
          type: 'text',
          value:
            'اگر هیچ مبلغی از اعتبار خود را خرج نکرده باشید، امکان لغو اعتبار و آزاد شدن مبلغ مسدود شده  وجود دارد. حتی در صورت خرج کردن بخشی از اعتبار، هیچ مبلغی از موجودی مسدود شده قابل برداشت نخواهد بود.',
        },
      ],
    },
    {
      parts: [
        {
          type: 'text',
          value:
            'در صورت عدم پرداخت قسط تا روز پنجم هر ماه، این مبلغ از موجودی غیر قابل برداشت شما کسر خواهد شد. در اعتبار با پشتوانه ترکیبی اولویت کسر موجودی با طرح طلا خواهد بود.',
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

  handleClick(action: IParts) {
    const activity: IUserActivity = {
      eventId: action.eventId,
      payloads: {},
    };
    this.userActivityService.action(activity).subscribe();
    this.router.navigateByUrl(action.link);
  }

  handleActiveSection(buttonLabel: SegmentItemsModel) {
    buttonLabel.id === 'profit' ? this.getProfit.set(true) : this.getProfit.set(false);
  }
}
