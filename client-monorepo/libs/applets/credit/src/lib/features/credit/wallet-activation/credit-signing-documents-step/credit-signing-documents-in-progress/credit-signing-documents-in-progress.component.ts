import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TimerCountDownModel } from '@digipay/ngx-count-down';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { NgxWaitingStepperComponent, WaitingStepperStateEnum } from '@digipay/ngx-waiting-stepper';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';

@Component({
  selector: 'app-credit-signing-documents-in-progress',
  templateUrl: './credit-signing-documents-in-progress.component.html',
  styleUrls: ['./credit-signing-documents-in-progress.component.scss'],
  standalone: true,
  imports: [NgxStatusResultModule, NgxWaitingStepperComponent, CreditAppBarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditSigningDocumentsInProgressComponent {
  title = 'در حال آماده‌سازی اسناد و مدارک برای امضا';

  time = input<TimerCountDownModel>();

  finish = output<void>();
  close = output<void>();

  getData() {
    this.finish.emit();
  }

  protected readonly WaitingStepperStateEnum = WaitingStepperStateEnum;
}
