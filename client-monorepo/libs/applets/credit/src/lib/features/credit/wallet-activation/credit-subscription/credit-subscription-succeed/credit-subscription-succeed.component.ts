import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { SubscriptionDetail } from '../../../data-access/models/credit/activation/subscription/subscription-status.response';
import { TimerCountDownModel } from '@digipay/ngx-count-down';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';
import { CreditScrollableViewComponent } from '../../../components/credit-scrollable-view/credit-scrollable-view.component';
import { ALLOCATION_PAYMENT_METHOD } from '../../../data-access/models/credit/pre-registration/credit-plan-group';
import { NgxAlert } from '@digipay/ngx-alert';
import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';

@Component({
  selector: 'app-credit-subscription-succeed',
  templateUrl: './credit-subscription-succeed.component.html',
  styleUrls: ['./credit-subscription-succeed.component.scss'],
  imports: [NgxStatusResultModule, CreditAppBarComponent, CreditScrollableViewComponent, NgxAlert],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditSubscriptionSucceedComponent {
  timer: TimerCountDownModel = { timeInSeconds: 10, timerType: 'mm:ss' };
  buttons: Buttons[] = [
    {
      style: 'fill',
      id: 'subscriptionCompleteProcessButton',
      mode: 'form',
      label: ' متوجه شدم',
      fullWidth: true,
      timer: this.timer,
    },
  ];
  alertMessage = 'کاربر گرامی، پس از تأیید و دریافت وام، امکان درخواست دوباره وام با این اشتراک وجود ندارد.';
  chosenPaymentMethod = input<ALLOCATION_PAYMENT_METHOD>();
  subscriptionDetail = input<SubscriptionDetail>();

  title = computed(() => {
    if (this.chosenPaymentMethod() === ALLOCATION_PAYMENT_METHOD.PECUNIARY) {
      return `اشتراک ${this.subscriptionDetail()?.title} شما استفاده شد`;
    }
    if (this.chosenPaymentMethod() === ALLOCATION_PAYMENT_METHOD.PECUNIARY_CREDIT) {
      return `اشتراک ${this.subscriptionDetail()?.title} شما فعال شد`;
    }
    return '';
  });
  description = computed(
    () => `امکان «وام خرید کالا» از اشتراک ${this.subscriptionDetail()?.title} شما برای تکمیل فرایند دریافت وام مورد استفاده قرار گرفت.`,
  );

  nextStep = output<void>();
  prevStep = output<void>();
}
