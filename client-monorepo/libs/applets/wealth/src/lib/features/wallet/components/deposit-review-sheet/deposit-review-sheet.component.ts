import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { WalletService } from '../../services/wallet.service';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { MessageService } from '@client-monorepo/common/utilities';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { WALLET_DEPOSIT_PROCESS_API } from '../../../../data-access/constants/api';
import { NgxIcon } from '@digipay/ngx-icon';
import { IDepositReview } from '../../models/deposit-review.interface';
import { IConfirmMetadata } from '../../models/bnpl-confirmation.interface';
import { IWalletProcessData } from '../../models/wallet-process.interface';

@Component({
  selector: 'wealth-applet-deposit-review-sheet',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent, NgxCalloutComponent, NgxDividerComponent, PipesModule, NgxIcon],
  templateUrl: './deposit-review-sheet.component.html',
  styleUrl: './deposit-review-sheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepositReviewSheetComponent implements OnInit {
  btnLoading = signal<boolean>(false);
  bottomSheetService = inject<NgxBottomSheetService>(NgxBottomSheetService);

  data = signal<IDepositReview | undefined>(undefined);
  notes = computed<string[]>(() => this.data()?.notes ?? []);

  protected readonly BorderColorsEnum = BorderColorsEnum;
  private walletService = inject(WalletService);
  private messageService = inject(MessageService);

  metadata = computed(() => {
    const metadata: IConfirmMetadata[] = [
      {
        title: 'خرید',
        value: this.data().walletTitle,
        type: 'text',
      },
    ];

    if (this.data().walletName === 'WALLET_GOLD') {
      metadata.push({
        title: 'کارمزد',
        type: 'amount',
        value: this.data().commission,
        isCommerssion: true,
      });
    }

    return metadata;
  });

  ngOnInit() {
    this.data.set(this.bottomSheetService.data());
  }

  continue() {
    const currentData = this.data();
    if (!currentData) {
      return;
    }

    this.btnLoading.set(true);
    const processData: IWalletProcessData = {
      action: 'confirmed',
      data: {
        walletName: currentData.walletName,
        amount: currentData.amount,
        walletId: currentData.walletId,
      },
    };

    this.walletService.walletProcess(WALLET_DEPOSIT_PROCESS_API, processData).subscribe((res) => {
      if (res.success && res && res.result && res.result.action === 'error') {
        this.messageService.showErrorMessage(res.result.data.message);
      }
      this.btnLoading.set(false);
    });
  }
}
