import { CommonModule } from '@angular/common';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { IInvestmentSwapBottomsheet, ISwapWallet } from '../../models';
import { GetWalletName } from '../../../wallet/services/get-wallet-name';
import { GetWalletImage } from '../../../wallet/services/get-wallet-image';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';

@Component({
  selector: 'wealth-applet-investment-swap-bottomsheet',
  standalone: true,
  imports: [CommonModule, PipesModule, NgxButtonComponent],
  templateUrl: './investment-swap-bottomsheet.component.html',
  styleUrl: './investment-swap-bottomsheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvestmentSwapBottomsheetComponent implements OnInit {
  getImage = GetWalletImage;
  getWalletName = GetWalletName;
  selectedWallet = signal<string | undefined>(undefined);
  data = signal<IInvestmentSwapBottomsheet | undefined>(undefined);

  private bottomsheetService = inject(NgxBottomSheetService);

  ngOnInit(): void {
    this.data.set(this.bottomsheetService.data().data);
    this.selectedWallet.set(this.data().defaultWallet);
  }

  handleSelection(wallet: ISwapWallet) {
    this.selectedWallet.set(wallet.walletName);
    this.bottomsheetService.outputData.set(wallet);
    this.bottomsheetService.closeBottomSheet();
  }
}
