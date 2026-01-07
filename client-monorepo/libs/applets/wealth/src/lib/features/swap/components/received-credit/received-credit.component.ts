import { PipesModule } from '@digipay/ng-lib-pipes';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'wealth-applet-received-credit',
  standalone: true,
  imports: [PipesModule],
  templateUrl: './received-credit.component.html',
  styleUrl: './received-credit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReceivedCreditComponent {
  creditAmount = input.required<number>();
}
