import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CreditWallet } from '../../data-access/models/credit/wallet/credit-wallet.model';
import { CreditWalletCardV2Component } from '../credit-wallet-card-v2/credit-wallet-card-v2.component';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';

@Component({
  selector: 'app-credit-wallet-list',
  templateUrl: './credit-wallet-list.component.html',
  styleUrls: ['./credit-wallet-list.component.scss'],
  standalone: true,
  imports: [CreditWalletCardV2Component, NgxSkeletonLoadingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditWalletListComponent {
  wallets = input<CreditWallet[]>();

  cardClick = output<CreditWallet>();

  clicked(wallet: CreditWallet) {
    this.cardClick.emit(wallet);
  }
}
