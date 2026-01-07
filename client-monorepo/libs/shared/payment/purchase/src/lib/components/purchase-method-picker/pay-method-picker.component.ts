import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { GATEWAY_TO_FEATURE_MAP, PAYMENT_GATEWAYS, PAYMENT_METHOD } from '@client-monorepo/payment/purchase';
import { InAppTacResponse } from '@client-monorepo/common/user';
import { MessageService } from '@client-monorepo/common/utilities';
import { WalletApiService } from '@client-monorepo/payment/wallet';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';

@Component({
  selector: 'payment-purchase-pay-method-picker',
  standalone: true,
  imports: [],
  templateUrl: './pay-method-picker.component.html',
  styleUrls: ['./pay-method-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayMethodPickerComponent {
  // Services
  private bottomSheetService = inject(NgxBottomSheetService);
  private messageService = inject(MessageService);
  private walletApiService = inject(WalletApiService);

  // Signals
  amount = signal<number>(0);
  balance = signal<number>(0);
  walletError = signal(false);
  tacResponse = signal<InAppTacResponse | null>(null);
  status = signal({
    IPG: true,
    WALLET: false,
    DPG: false,
  });

  constructor() {
    const data = this.bottomSheetService?.data();
    this.amount.set(data.amount);
    this.tacResponse.set(data.tacResponse);

    this.getWalletBalance();
    this.checkWalletStatus();
  }

  private getWalletBalance() {
    this.walletApiService.getWalletBalance().subscribe(
      (balanceResponse) => {
        this.balance.set(balanceResponse.amount);
      },
      (_) => {
        this.walletError.set(true);
      },
    );
  }

  private checkWalletStatus() {
    const newStatus = { ...this.status() };
    newStatus.IPG = this.tacResponse()!.gateways.indexOf(PAYMENT_GATEWAYS.IPG) >= 0;
    newStatus.WALLET = this.tacResponse()!.gateways.indexOf(PAYMENT_GATEWAYS.WALLET) >= 0;
    newStatus.DPG = this.tacResponse()!.gateways.indexOf(PAYMENT_GATEWAYS.DPG) >= 0;
    this.status.set(newStatus);
  }

  itemClick(method: keyof typeof PAYMENT_METHOD) {
    if (method === 'WALLET' && this.walletError()) {
      this.messageService.showErrorMessage('در حال حاضر امکان استفاده از کیف پول وجود ندارد');
      return;
    }

    if (method === 'WALLET' && this.balance() < this.amount()) {
      this.messageService.showErrorMessage('موجودی کافی نیست');
      return;
    }

    const FEATURE_CODE = GATEWAY_TO_FEATURE_MAP[method as keyof typeof GATEWAY_TO_FEATURE_MAP];
    const feature = this.tacResponse()!.features[FEATURE_CODE];
    this.bottomSheetService.outputData.set({ method, feature });
    this.bottomSheetService.closeBottomSheet();
  }
}
