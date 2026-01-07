import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { CreditAppBarComponent } from '../../../../components/credit-app-bar/credit-app-bar.component';

@Component({
  selector: 'app-credit-cheque-step-ready-to-process',
  templateUrl: './credit-cheque-step-ready-to-process.component.html',
  styleUrls: ['./credit-cheque-step-ready-to-process.component.scss'],
  imports: [NgxStatusResultModule, CreditAppBarComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditChequeStepReadyToProcessComponent {
  buttons: Buttons[] = [
    {
      id: 'creditChequeReadyToProcessButton',
      mode: 'section',
      style: 'fill',
      label: 'متوجه شدم',
    },
  ];
  close = output<void>();
}
