import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';

import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';

@Component({
  selector: 'app-credit-subscription-digipay-accepted',
  standalone: true,
  imports: [NgxStatusResultModule, CreditAppBarComponent],
  templateUrl: './credit-subscription-digipay-accepted.component.html',
  styleUrl: './credit-subscription-digipay-accepted.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditSubscriptionDigipayAcceptedComponent {
  buttons: Buttons[] = [
    {
      style: 'fill',
      id: 'subscriptionDigipayAcceptedContinueButton',
      mode: 'form',
      label: ' متوجه شدم',
      fullWidth: true,
    },
  ];
  title = 'در انتظار تایید بانک';
  description =
    'عضویت اشتراک شما با موفقیت انجام شد و مدارکتان برای بانک ارسال شده است. طی ۷۲ ساعت کاری آینده نتیجه تایید مدارک را از طریق پیامک به شما اطلاع می‌دهیم.';
  closeStep = output();
}
