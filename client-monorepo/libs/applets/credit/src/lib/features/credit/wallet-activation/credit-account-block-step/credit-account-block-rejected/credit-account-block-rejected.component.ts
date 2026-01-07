import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { CreditAccountBlockMessageComponent } from '../credit-account-block-message/credit-account-block-message.component';

@Component({
  selector: 'app-credit-account-block-rejected',
  templateUrl: './credit-account-block-rejected.component.html',
  styleUrls: ['./credit-account-block-rejected.component.scss'],
  standalone: true,
  imports: [CreditAccountBlockMessageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditAccountBlockRejectedComponent {
  close = output();
}
