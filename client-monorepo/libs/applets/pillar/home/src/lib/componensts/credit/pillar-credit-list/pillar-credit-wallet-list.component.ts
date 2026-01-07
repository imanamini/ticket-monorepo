import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CreditWallet, SERVICE_TYPE } from '@client-monorepo/applets/credit';
import { PillarCreditWalletCardComponent } from '../pillar-credit-wallet-card/pillar-credit-wallet-card.component';

@Component({
  selector: 'pillar-credit-wallet-list',
  templateUrl: './pillar-credit-wallet-list.component.html',
  styleUrls: ['./pillar-credit-wallet-list.component.scss'],
  standalone: true,
  imports: [PillarCreditWalletCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PillarCreditWalletListComponent {
  wallets = input<CreditWallet[]>();
  show2ColumnLayout = input<boolean>(false); // Changed to boolean flag

  cardClick = output<CreditWallet>();

  clicked(wallet: CreditWallet) {
    this.cardClick.emit(wallet);
  }

  protected readonly SERVICES_TYPE = SERVICE_TYPE;
}
