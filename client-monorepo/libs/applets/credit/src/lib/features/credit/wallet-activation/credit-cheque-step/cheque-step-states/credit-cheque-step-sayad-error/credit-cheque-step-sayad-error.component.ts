import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { NgxAlert } from '@digipay/ngx-alert';
import { CreditAppBarComponent } from '../../../../components/credit-app-bar/credit-app-bar.component';

@Component({
  selector: 'app-credit-cheque-step-sayad-error',
  templateUrl: './credit-cheque-step-sayad-error.component.html',
  styleUrls: ['./credit-cheque-step-sayad-error.component.scss'],
  imports: [NgxStatusResultModule, NgxAlert, CreditAppBarComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditChequeStepSayadErrorComponent {
  alertMessage = input<string>();
  description = computed(() =>
    this.alertMessage()
      ? 'چک در وجه چند شخص یا نهاد ثبت شده است.'
      : 'شناسه صیادی در سامانه‌ی صیادی ثبت نشده است یا با اطلاعات نادرست ثبت شده است.',
  );
  buttons: Buttons[] = [
    {
      id: 'creditChequeSayadErrorButton',
      mode: 'form',
      style: 'fill',
      label: 'متوجه شدم',
      fullWidth: true,
    },
  ];
  close = output<void>();
}
