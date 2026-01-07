import { Component, Input } from '@angular/core';
import { BalanceInformationResponseInterface } from '../../../../api/models/wallet-management/balance.interface';

@Component({
  selector: 'app-wallet-management-chart-label',
  templateUrl: './wallet-management-chart-label.component.html',
  styleUrls: ['./wallet-management-chart-label.component.scss']
})
export class WalletManagementChartLabelComponent {
  @Input() balanceInformation: BalanceInformationResponseInterface;
}
