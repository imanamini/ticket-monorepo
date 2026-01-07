import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BnplBannerComponent } from '../../../../shared/components/bnpl-banner/bnpl-banner/bnpl-banner.component';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'wealth-applet-wallet-cashout-notice',
  standalone: true,
  imports: [CommonModule, BnplBannerComponent, PipesModule, NgxButtonComponent],
  templateUrl: './wallet-cashout-notice.component.html',
  styleUrl: './wallet-cashout-notice.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletCashoutNoticeComponent implements OnInit {
  private bottomsheetService = inject(NgxBottomSheetService);
  bnplAmount = signal<number>(0);

  ngOnInit() {
    this.setBnplAmount();
  }

  private setBnplAmount() {
    const withdrawalBalance = this.bottomsheetService.data().data.withdrawalBalance;
    const roundDownAmount = this.bottomsheetService.data().data.roundDownAmount;
    const mod = withdrawalBalance % roundDownAmount;
    const rounded = withdrawalBalance - mod;
    this.bnplAmount.set(rounded);
  }

  actionHandler(action: 'cashout' | 'getCredit') {
    this.bottomsheetService.outputData.set(action);
    this.bottomsheetService.closeBottomSheet();
  }
}
