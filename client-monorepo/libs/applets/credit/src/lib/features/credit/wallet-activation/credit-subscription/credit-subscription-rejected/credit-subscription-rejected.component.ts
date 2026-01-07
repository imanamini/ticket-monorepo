import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';

import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';

@Component({
  selector: 'app-credit-subscription-rejected',
  standalone: true,
  imports: [NgxStatusResultModule, CreditAppBarComponent],
  templateUrl: './credit-subscription-rejected.component.html',
  styleUrl: './credit-subscription-rejected.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditSubscriptionRejectedComponent {
  buttons: Buttons[] = [
    {
      style: 'fill',
      id: 'subscriptionRejectedContinueButton',
      mode: 'form',
      label: ' متوجه شدم',
      fullWidth: true,
    },
  ];
  title = 'رد توسط بانک';
  description = 'به‌دلیل سیاست‌های اعتباری یا محدودیت‌های عملیاتی بانک، در حال حاضر امکان پرداخت این وام وجود ندارد.';
  closeStep = output();
}
