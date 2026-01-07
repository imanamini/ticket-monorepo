import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { CreditAccountBlockMessageComponent } from '../credit-account-block-message/credit-account-block-message.component';

@Component({
  selector: 'app-credit-account-block-in-progress-sms',
  templateUrl: './credit-account-block-in-progress-sms.component.html',
  styleUrls: ['./credit-account-block-in-progress-sms.component.scss'],
  standalone: true,
  imports: [CreditAccountBlockMessageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditAccountBlockInProgressSmsComponent {
  close = output();
}
