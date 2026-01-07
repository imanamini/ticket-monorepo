import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { WalletService } from '../../services/wallet.service';

import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { MessageService } from '@client-monorepo/common/utilities';
import { WALLET_DEPOSIT_PROCESS_API, WALLET_WITHDROW_PROCESS_API } from '../../../../data-access/constants/api';
import { ConvertBankName } from '../../../../data-access/constants/banks-code-name';
import { IWalletProcessData } from '../../models/wallet-process.interface';

@Component({
  selector: 'wealth-applet-wallet-transaction-info',
  standalone: true,
  imports: [PipesModule, NgxButtonComponent, NgxDividerComponent, NgxCalloutComponent],
  templateUrl: './wallet-transaction-info.component.html',
  styleUrl: './wallet-transaction-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletTransactionInfoComponent implements OnInit {
  btnLoading = signal<boolean>(false);
  bottomSheetService = inject<NgxBottomSheetService>(NgxBottomSheetService);
  protected readonly BorderColorsEnum = BorderColorsEnum;
  private walletService = inject(WalletService);
  private messageService = inject(MessageService);
  bankName = signal<string | undefined>(undefined);
  info = signal(null);

  ngOnInit() {
    this.info.set(this.bottomSheetService.data().data);
    if (this.info().iban) {
      this.bankName.set(ConvertBankName(this.info().iban));
    }
  }

  continue() {
    this.btnLoading.set(true);
    const processData: IWalletProcessData = {
      action: 'confirmed',
      data: {
        walletName: this.info().walletName,
        amount: this.info().amount,
      },
    };
    const apiUrl = this.info().type === 'cashOut' ? WALLET_WITHDROW_PROCESS_API : WALLET_DEPOSIT_PROCESS_API;

    this.walletService.walletProcess(apiUrl, processData).subscribe((res) => {
      if (res.success && res && res.result && res.result.action === 'error') {
        this.messageService.showErrorMessage(res.result.data.message);
      }
      this.btnLoading.set(false);
    });
  }

  editPrice() {
    this.btnLoading.set(false);
    this.bottomSheetService.outputData.set({ editing: true });
    this.bottomSheetService.closeBottomSheet();
  }
}
