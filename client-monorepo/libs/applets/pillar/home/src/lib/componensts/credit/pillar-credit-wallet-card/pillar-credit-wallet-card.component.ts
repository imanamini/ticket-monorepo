import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import {
  AccountStatus,
  CREDIT_WALLET_STATUS,
  CreditDigipayImageComponent,
  CreditWallet,
  FUND_PROVIDER_CODE,
  SERVICE_TYPE,
} from '@client-monorepo/applets/credit';
import { NgxCard } from '@digipay/ngx-card';
import { NgxBadgeModule } from '@digipay/ngx-badge';

@Component({
  selector: 'pillar-credit-wallet-card',
  templateUrl: './pillar-credit-wallet-card.component.html',
  styleUrls: ['./pillar-credit-wallet-card.component.scss'],
  standalone: true,
  imports: [NgxCard, CreditDigipayImageComponent, NgxCard, NgxCard, NgxBadgeModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PillarCreditWalletCardComponent {
  wallet = input<CreditWallet>();
  cardSize = input<string>('large');
  hasMainLabel = computed(() => {
    return (
      this.wallet()?.fundProviderCode === FUND_PROVIDER_CODE.DIGIPAY &&
      this.wallet()?.status === CREDIT_WALLET_STATUS.IN_PROGRESS &&
      this.wallet()?.serviceType === SERVICE_TYPE.BNPL
    );
  });

  walletInProgressActive = computed(() => {
    return (
      (this.wallet()?.status === CREDIT_WALLET_STATUS.INACTIVE ||
        this.wallet()?.status === CREDIT_WALLET_STATUS.START_ACTIVATION ||
        this.wallet()?.status === CREDIT_WALLET_STATUS.OPERATION_PROCESS ||
        this.wallet()?.status === CREDIT_WALLET_STATUS.IN_PROGRESS) &&
      this.wallet()?.serviceType === SERVICE_TYPE.BNPL
    );
  });

  cardClick = output<CreditWallet>();

  cardClicked() {
    this.cardClick.emit(this.wallet()!);
  }

  protected readonly SERVICE_TYPE = SERVICE_TYPE;
  protected readonly AccountStatus = AccountStatus;
}
