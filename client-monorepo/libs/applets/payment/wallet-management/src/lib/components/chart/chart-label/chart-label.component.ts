import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { WALLET_COLORS } from './colors.enum';
import { BalanceInformationForPreview } from '../../../data-access/models/balance.interface';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgIf } from '@angular/common';

@Component({
  selector: 'wallet-mng-applet-chart-label',
  templateUrl: './chart-label.component.html',
  styleUrls: ['./chart-label.component.scss'],
  standalone: true,
  imports: [PipesModule, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartLabelComponent {
  balanceInformation = input.required<BalanceInformationForPreview | null>();
  cashBackgroundColor = WALLET_COLORS.BLUE;
  nonCashBackgroundColor = WALLET_COLORS.MIDDLE_BLUE;
  giftCardBackgroundColor = WALLET_COLORS.GREEN;
}
