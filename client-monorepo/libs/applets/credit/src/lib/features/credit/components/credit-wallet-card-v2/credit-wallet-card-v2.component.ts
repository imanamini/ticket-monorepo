import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CREDIT_WALLET_STATUS, CreditWallet } from '../../data-access/models/credit/wallet/credit-wallet.model';
import { FUND_PROVIDER_CODE } from '../../data-access/models/credit/fund-provider/fund-provider-code';
import { SERVICE_TYPE } from '../../data-access/models/credit/service-type/service-type.model';
import { NgxCard } from '@digipay/ngx-card';
import { CreditDigipayImageComponent } from '../credit-digipay-image/credit-digipay-image.component';
import { NgxBadgeModule } from '@digipay/ngx-badge';

@Component({
  selector: 'app-credit-wallet-card-v2',
  templateUrl: './credit-wallet-card-v2.component.html',
  styleUrls: ['./credit-wallet-card-v2.component.scss'],
  standalone: true,
  imports: [NgxCard, CreditDigipayImageComponent, NgxBadgeModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditWalletCardV2Component {
  wallet = input<CreditWallet>();

  hasMainLabel = computed(() => {
    return (
      this.wallet()?.fundProviderCode === FUND_PROVIDER_CODE.DIGIPAY &&
      this.wallet()?.status === CREDIT_WALLET_STATUS.IN_PROGRESS &&
      this.wallet()?.serviceType === SERVICE_TYPE.BNPL
    );
  });

  walletInProgressActive = computed(() => {
    return (
      this.wallet()?.status === CREDIT_WALLET_STATUS.INACTIVE ||
      this.wallet()?.status === CREDIT_WALLET_STATUS.START_ACTIVATION ||
      this.wallet()?.status === CREDIT_WALLET_STATUS.OPERATION_PROCESS ||
      this.wallet()?.status === CREDIT_WALLET_STATUS.IN_PROGRESS
    );
  });

  cardClick = output<CreditWallet>();

  cardClicked() {
    this.cardClick.emit(this.wallet()!);
  }

  protected readonly SERVICE_TYPE = SERVICE_TYPE;
}
