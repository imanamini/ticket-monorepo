import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { finalize } from 'rxjs';
import {
  REFUND_CAP_STATUS,
  REFUND_RESULT_STATUS,
  RefundResult,
  SERVICE_STATUS,
  SERVICES_TYPE,
  SubscriptionApiService,
  SubscriptionPlan,
} from '@client-monorepo/common/subscription';
import { currencyFormat } from '@digipay/strings';
import { SubscriptionRefundService } from '../../data-access/services/subscription-refund.service';
import { UiDialogBtmSheetComponent } from '../ui-dialog-btm-sheet/ui-dialog-btm-sheet.component';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { generateServiceConfig } from '../ui-plan-services/generate-service-config';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'subscription-applet-subscription-refund',
  standalone: true,
  templateUrl: './subscription-refund.component.html',
  styleUrl: './subscription-refund.component.scss',
  imports: [PipesModule, UiDialogBtmSheetComponent, NgxButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionRefundComponent {
  isLoading = signal<boolean>(false);

  plan = signal<SubscriptionPlan>({} as SubscriptionPlan);
  private bottomSheetService = inject(NgxBottomSheetService);
  private subscriptionApiService = inject(SubscriptionApiService);
  private subscriptionRefundService = inject(SubscriptionRefundService);
  services = computed(() => {
    const planServices = this.plan().services;

    const initiatedServices = planServices.filter((service) => {
      // Default case: service must be initiated
      return service.status === SERVICE_STATUS.INITIATED;
    });

    return initiatedServices.map((service) => generateServiceConfig(service));
  });
  content = computed<{
    title: string;
    description: string;
    footnote: string;
  }>(() => {
    const hasCoinService = this.plan()?.services?.find((service) => service.type === SERVICES_TYPE.COIN);
    const footnote = hasCoinService
      ? 'سکه‌های پی‌کلاب به شما تخصیص داده شده‌اند و قابل بازگشت نیستند. با استفاده از این سکه‌ها، می‌توانید از مزایا و جوایز دیجی‌پی در پی‌کلاب بهره‌مند شوید.'
      : '';
    if (this.plan()?.refundDetail?.isRefundable) {
      return {
        title: 'آیا از لغو اشتراک خود مطمئن هستید؟',
        description: 'توجه داشته باشید که در صورت لغو اشتراک، وجه بازگشتی به کیف‌پول شما واریز می‌گردد.',
        footnote,
      };
    }
    return {
      title: 'آیا از لغو اشتراک خود مطمئن هستید؟',
      description:
        'درصورت پایان اشتراک، دسترسی شما به صفحه‌ی اشتراک فعلی قطع می‌شود و دیگر قادر به استفاده از خدمات فعال این اشتراک نخواهید بود.',
      footnote,
    };
  });

  constructor() {
    this.getData();
  }

  getData(): void {
    const bottomSheetData = this.bottomSheetService.data();
    this.plan.set(bottomSheetData?.plan);
  }

  confirmRefund(): void {
    this.isLoading.set(true);
    if (this.plan().refundDetail.isRefundable) {
      this.subscriptionApiService
        .refundSubscriptionApi()
        .pipe(
          finalize(() => {
            this.isLoading.set(false);
            this.bottomSheetService.outputData.set(true);
            this.bottomSheetService.closeBottomSheet();
          }),
        )
        .subscribe({
          next: () => {
            const amount = currencyFormat(this.plan()?.refundDetail?.amount);
            this.subscriptionRefundService.setRefundResult({
              status: REFUND_RESULT_STATUS.SUCCESS,
              title: 'درخواست شما با موفقیت ثبت شد!',
              description: `پس از انجام بررسی، مبلغ ${amount} ریال
به کیف پول شما واریز خواهد شد.`,
              buttonText: 'متوجه شدم',
              image: 'success',
            });
          },
          error: (err) => {
            this.handleErrorResult(err.error);
          },
        });
    } else if (this.plan().refundDetail.isClosable) {
      this.subscriptionApiService
        .closeSubscriptionApi()
        .pipe(
          finalize(() => {
            this.isLoading.set(false);
            this.bottomSheetService.outputData.set(true);
            this.bottomSheetService.closeBottomSheet();
          }),
        )
        .subscribe({
          next: () => {
            this.subscriptionRefundService.setRefundResult({
              status: REFUND_RESULT_STATUS.SUCCESS,
              title: 'درخواست شما با موفقیت ثبت شد!',
              description: 'شما می‌توانید با مراجعه به صفحه پروفایل، جهت خرید اشتراک جدید اقدام نمایید!',
              buttonText: 'متوجه شدم',
              image: 'success',
            });
          },
          error: (err) => {
            this.handleErrorResult(err.error);
          },
        });
    }
  }

  handleErrorResult(error: any): void {
    let refundResult: RefundResult;
    switch (error.result.status) {
      case REFUND_CAP_STATUS.DAILY:
      case REFUND_CAP_STATUS.WEEKLY:
      case REFUND_CAP_STATUS.MONTHLY:
        refundResult = {
          status: REFUND_RESULT_STATUS.FAILED,
          isCap: true,
          title: 'شما قادر به لغو اشتراک نیستید!',
          description: 'با توجه به محدودیت در تعداد دفعات لغو، شما قادر به لغو اشتراک نیستید. لطفا با توجه به جدول زیر بعدا تلاش کنید!',
          buttonText: 'بازگشت به مدیریت اشتراک',
          image: 'failed',
        };
        break;
      default:
        refundResult = {
          status: REFUND_RESULT_STATUS.FAILED,
          title: 'درخواست شما ثبت نشد!',
          description: `متاسفانه مشکلی رخ داده است!
لطفا پس از چند دقیقه، مجددا تلاش کنید.`,
          buttonText: 'بازگشت به مدیریت اشتراک',
          image: 'failed',
        };
    }
    this.subscriptionRefundService.setRefundResult(refundResult);
  }
}
