import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';
import { NgxWaitingStepperComponent, WaitingStepperStateEnum } from '@digipay/ngx-waiting-stepper';

@Component({
  selector: 'app-credit-scoring-smc-step-in-progress',
  templateUrl: './credit-scoring-smc-step-in-progress.component.html',
  standalone: true,
  imports: [NgxStatusResultModule, CreditAppBarComponent, NgxWaitingStepperComponent],
  styleUrls: ['./credit-scoring-smc-step-in-progress.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditScoringSmcStepInProgressComponent {
  back = output<void>();
  data = {
    title: 'در حال امکان‌سنجی...',
    message: 'لطفا تا مشخص شدن نتیجه منتظر بمانید.',
  };
  protected readonly WaitingStepperStateEnum = WaitingStepperStateEnum;
}
