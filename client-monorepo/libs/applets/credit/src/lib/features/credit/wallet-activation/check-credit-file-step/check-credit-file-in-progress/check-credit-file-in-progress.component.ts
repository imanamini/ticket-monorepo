import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { TimerCountDownModel } from '@digipay/ngx-count-down';
import { NgxWaitingStepperComponent, WaitingStepperStateEnum } from '@digipay/ngx-waiting-stepper';

@Component({
  selector: 'app-check-credit-file-in-progress',
  templateUrl: './check-credit-file-in-progress.component.html',
  standalone: true,
  styleUrls: ['./check-credit-file-in-progress.component.scss'],
  imports: [NgxStatusResultModule, NgxWaitingStepperComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckCreditFileInProgressComponent {
  title = 'در حال بررسی پرونده اعتباری شما هستیم.';
  time: TimerCountDownModel = { timeInSeconds: 5, timerType: 'custom' };

  finishCountDown = output();

  onFinish(): void {
    this.finishCountDown.emit();
  }

  protected readonly WaitingStepperStateEnum = WaitingStepperStateEnum;
}
