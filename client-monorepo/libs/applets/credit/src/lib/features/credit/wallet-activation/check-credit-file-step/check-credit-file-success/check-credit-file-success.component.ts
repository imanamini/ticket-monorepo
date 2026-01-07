import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';

@Component({
  selector: 'app-check-credit-file-success',
  templateUrl: './check-credit-file-success.component.html',
  styleUrls: ['./check-credit-file-success.component.scss'],
  standalone: true,
  imports: [NgxStatusResultModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckCreditFileSuccessComponent {
  buttons: Buttons[] = [
    {
      id: 'primary',
      style: 'fill',
      label: 'ادامه',
      fullWidth: true,
      mode: 'form',
    },
  ];
  title = 'پرونده اعتباری شما تایید شد';
  description = 'اکنون می توانید فرایند دریافت وام را ادامه دهید';

  nextStep = output();

  onFinish(): void {
    this.nextStep.emit();
  }
}
