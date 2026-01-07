import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';

@Component({
  selector: 'app-credit-cheque-step-camera-permission',
  templateUrl: './credit-cheque-step-camera-permission.component.html',
  styleUrls: ['./credit-cheque-step-camera-permission.component.scss'],
  imports: [NgxStatusResultModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditChequeStepCameraPermissionComponent {
  buttons: Buttons[] = [
    {
      label: 'تایید دسترسی',
      style: 'fill',
      id: 'chequeStepCameraPermissionButton',
      mode: 'form',
      fullWidth: true,
    },
  ];
  close = output<void>();
  accessRequest = output<void>();
}
