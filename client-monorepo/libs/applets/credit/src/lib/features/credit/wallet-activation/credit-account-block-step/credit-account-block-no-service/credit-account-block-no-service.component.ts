import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { CreditAccountBlockMessageComponent } from '../credit-account-block-message/credit-account-block-message.component';

@Component({
  selector: 'app-credit-account-block-no-service',
  templateUrl: './credit-account-block-no-service.component.html',
  styleUrls: ['./credit-account-block-no-service.component.scss'],
  standalone: true,
  imports: [CreditAccountBlockMessageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditAccountBlockNoServiceComponent {
  close = output();
  retry = output();
}
