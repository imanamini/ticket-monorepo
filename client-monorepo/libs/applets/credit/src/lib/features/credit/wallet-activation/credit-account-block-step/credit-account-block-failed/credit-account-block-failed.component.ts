import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { CreditAccountBlockMessageComponent } from '../credit-account-block-message/credit-account-block-message.component';

@Component({
  selector: 'app-credit-account-block-failed',
  templateUrl: './credit-account-block-failed.component.html',
  styleUrls: ['./credit-account-block-failed.component.scss'],
  standalone: true,
  imports: [CreditAccountBlockMessageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditAccountBlockFailedComponent {
  close = output();
}
