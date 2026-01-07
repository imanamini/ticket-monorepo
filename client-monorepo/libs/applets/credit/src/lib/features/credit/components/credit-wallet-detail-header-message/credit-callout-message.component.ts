import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PipesModule } from '@digipay/ng-lib-pipes';

@Component({
  selector: 'ui-credit-callout-message',
  templateUrl: './credit-callout-message.component.html',
  styleUrls: ['./credit-callout-message.component.scss'],
  standalone: true,
  imports: [PipesModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditCalloutMessageComponent {
  title = input<string>();
  description = input<string>();
}
