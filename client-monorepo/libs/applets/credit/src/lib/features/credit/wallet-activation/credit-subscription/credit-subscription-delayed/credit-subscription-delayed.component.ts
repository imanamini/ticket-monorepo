import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';

import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';
import { CreditScrollableViewComponent } from '../../../components/credit-scrollable-view/credit-scrollable-view.component';
import { NgxAlert } from '@digipay/ngx-alert';

@Component({
  selector: 'app-credit-subscription-delayed',
  standalone: true,
  imports: [NgxStatusResultModule, CreditAppBarComponent, CreditScrollableViewComponent, NgxAlert],
  templateUrl: './credit-subscription-delayed.component.html',
  styleUrl: './credit-subscription-delayed.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditSubscriptionDelayedComponent {
  buttons: Buttons[] = [
    {
      style: 'fill',
      id: 'subscriptionDelayedContinueButton',
      mode: 'form',
      label: ' متوجه شدم',
      fullWidth: true,
    },
  ];
  title = input('');
  description = input('');
  closeStep = output();

  submit() {
    this.closeStep.emit();
  }
}
