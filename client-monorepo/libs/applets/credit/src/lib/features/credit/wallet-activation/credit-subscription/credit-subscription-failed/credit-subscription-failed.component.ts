import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { SubscriptionDetail } from '../../../data-access/models/credit/activation/subscription/subscription-status.response';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { ALLOCATION_PAYMENT_METHOD } from '../../../data-access/models/credit/pre-registration/credit-plan-group';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';
import { CreditScrollableViewComponent } from '../../../components/credit-scrollable-view/credit-scrollable-view.component';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';

@Component({
  selector: 'app-credit-subscription-failed',
  templateUrl: './credit-subscription-failed.component.html',
  styleUrls: ['./credit-subscription-failed.component.scss'],
  imports: [NgxStatusResultModule, CreditAppBarComponent, CreditScrollableViewComponent, NgxCalloutComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditSubscriptionFailedComponent {
  calloutTitle = 'اقدامات لازم برای لغو طرح فعلی:';
  calloutMessages = ['مراجعه به مدیریت اشتراک', 'لغو طرح قبلی', 'ادامه فرایند دریافت وام'];

  subscriptionDetail = input<SubscriptionDetail>();

  title = computed(() => `خرید اشتراک ${this.subscriptionDetail()?.title} ضروری است`);
  description = computed(() =>
    this.subscriptionDetail()?.hasIncompatiblePlan
      ? 'با اشتراک فعلی شما، امکان دریافت این وام وجود ندارد.  لطفاً ابتدا اشتراک فعلی خود را لغو کرده و سپس اقدام کنید.'
      : `برای تکمیل فرایند دریافت وام و بهره‌مندی از امکانات بیشتر، لازم است اشتراک ${this.subscriptionDetail()?.title} را تهیه کنید.`,
  );
  buttonLabel = computed(() => (this.subscriptionDetail()?.hasIncompatiblePlan ? 'لغو طرح قبلی' : 'ادامه'));

  buttons = computed<Buttons[]>(() => {
    return [
      {
        style: 'fill',
        id: 'subscriptionFailedContinueButton',
        mode: 'form',
        label: this.buttonLabel(),
        fullWidth: true,
      },
    ];
  });
  nextStep = output<void>();
  goToSubscription = output<void>();
  initiateSubscription = output<ALLOCATION_PAYMENT_METHOD>();
  prevStep = output<void>();

  onNext() {
    if (this.subscriptionDetail()?.hasIncompatiblePlan) {
      this.goToSubscription.emit();
      return;
    }
    this.nextStep.emit();
  }
}
