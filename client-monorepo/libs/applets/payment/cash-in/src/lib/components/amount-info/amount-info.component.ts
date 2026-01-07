import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import { PipesModule } from '@digipay/ng-lib-pipes';

@Component({
  selector: 'cash-in-applet-amount-info',
  templateUrl: './amount-info.component.html',
  styleUrls: ['./amount-info.component.scss'],
  standalone: true,
  imports: [PipesModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AmountInfoComponent {
  @Input() walletBalance!: number;
}
