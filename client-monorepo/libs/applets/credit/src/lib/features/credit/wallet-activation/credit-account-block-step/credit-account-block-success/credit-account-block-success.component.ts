import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { CreditAccountBlockMessageComponent } from '../credit-account-block-message/credit-account-block-message.component';

@Component({
  selector: 'app-credit-account-block-success',
  templateUrl: './credit-account-block-success.component.html',
  styleUrls: ['./credit-account-block-success.component.scss'],
  standalone: true,
  imports: [CreditAccountBlockMessageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditAccountBlockSuccessComponent {
  nextStep = output();
  close = output();
}
