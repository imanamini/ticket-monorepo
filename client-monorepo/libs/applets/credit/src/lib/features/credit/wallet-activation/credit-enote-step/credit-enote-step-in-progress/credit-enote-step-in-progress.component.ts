import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { TimerCountDownModel } from '@digipay/ngx-count-down';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { NgxWaitingStepperComponent, WaitingStepperStateEnum } from '@digipay/ngx-waiting-stepper';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';

@Component({
  selector: 'app-credit-enote-step-in-progress',
  templateUrl: './credit-enote-step-in-progress.component.html',
  styleUrls: ['./credit-enote-step-in-progress.component.scss'],
  standalone: true,
  imports: [NgxStatusResultModule, NgxWaitingStepperComponent, CreditAppBarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditEnoteStepInProgressComponent {
  title = 'در انتظار بررسی اطلاعات سفته';
  description = 'در حال بررسی اطلاعات و صدور سفته الکترونیک برای شما هستیم ...';
  time: TimerCountDownModel = { timeInSeconds: 60, timerType: 'custom' };
  finish = output<void>();
  close = output<void>();

  finishCountDown(): void {
    this.finish.emit();
  }

  protected readonly WaitingStepperStateEnum = WaitingStepperStateEnum;
}
