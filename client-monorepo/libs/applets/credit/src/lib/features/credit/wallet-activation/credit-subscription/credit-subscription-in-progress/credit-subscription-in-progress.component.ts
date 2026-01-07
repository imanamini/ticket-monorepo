import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { TimerCountDownModel } from '@digipay/ngx-count-down';
import { NgxWaitingStepperComponent, WaitingStepperStateEnum } from '@digipay/ngx-waiting-stepper';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';
import { CreditScrollableViewComponent } from '../../../components/credit-scrollable-view/credit-scrollable-view.component';

@Component({
  selector: 'app-credit-subscription-in-progress',
  templateUrl: './credit-subscription-in-progress.component.html',
  styleUrls: ['./credit-subscription-in-progress.component.scss'],
  imports: [NgxStatusResultModule, NgxWaitingStepperComponent, CreditAppBarComponent, CreditScrollableViewComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditSubscriptionInProgressComponent {
  checkCountDown = 5;
  title = 'در حال بررسی اشتراک دیجی‌پی';
  description = 'دریافت وام تنها با عضویت در دیجی‌پی امکان‌پذیر است.';
  timer: TimerCountDownModel = {
    timeInSeconds: this.checkCountDown,
    timerType: 'custom',
  };
  finishCountDown = output<void>();
  prevStep = output<void>();

  onFinish(): void {
    this.finishCountDown.emit();
  }

  protected readonly WaitingStepperStateEnum = WaitingStepperStateEnum;
}
