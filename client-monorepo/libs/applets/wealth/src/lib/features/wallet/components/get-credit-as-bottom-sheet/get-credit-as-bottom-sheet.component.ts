import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { IWallet } from '../../models/wallet.interface';
import { NgxIcon } from '@digipay/ngx-icon';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';
import { WALLET_COORDINATOR_PROCESS_API } from '../../../../data-access/constants/api';
import { UserActivitiesService } from '../../../../shared/services/activities/user-activities.service';
import { WalletService } from '../../services/wallet.service';
import { finalize } from 'rxjs';
import { IWalletProcessData } from '../../models/wallet-process.interface';

@Component({
  selector: 'wealth-applet-get-credit-as-bottom-sheet',
  standalone: true,
  imports: [CommonModule, NgxIcon, PipesModule, NgxSpinnerModule],
  templateUrl: './get-credit-as-bottom-sheet.component.html',
  styleUrl: './get-credit-as-bottom-sheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GetCreditAsBottomSheetComponent implements OnInit {
  wallets = signal<IWallet[] | undefined>(undefined);
  loadingWallet = signal<string | null>(null);
  walletId: string;

  imageUrl = computed(() => {
    return this.wallets().map((x) =>
      x.walletName === 'WALLET_FX'
        ? (x.walletLogo = './wealth-assets/images/deposit/fixed-guid.svg')
        : (x.walletLogo = './wealth-assets/images/deposit/gold-guid.svg'),
    );
  });

  private walletService = inject(WalletService);
  private bottomSheetService = inject(NgxBottomSheetService);
  private userActivitiesService = inject(UserActivitiesService);

  ngOnInit(): void {
    this.wallets.set(this.bottomSheetService.data().wallets);
    this.walletId = this.bottomSheetService.data().walletId;
  }

  handleSelectedDestination(wallet: IWallet) {
    this.loadingWallet.set(wallet.walletName);
    if (wallet) {
      const processData: IWalletProcessData = {
        data: {
          walletName: wallet.walletName,
          action: 'start_journey',
          terms: 'bnpl_terms',
          walletId: this.walletId.toLowerCase(),
        },
      };
      const eventId = wallet.walletName === 'WALLET_FX' ? 'WW_ReqFix' : wallet.walletName === 'WALLET_GOLD' ? 'WW_ReqGold' : 'WW_ReqMix';
      const activity = {
        eventId,
        payloads: { walletId: this.walletId.toLowerCase() || '' },
      };
      this.userActivitiesService.action(activity).subscribe();
      this.walletService
        .walletProcess(WALLET_COORDINATOR_PROCESS_API, processData)
        .pipe(finalize(() => this.loadingWallet.set(null)))
        .subscribe();
    }
  }

  getImageUrl(walletName: string): string {
    switch (walletName) {
      case 'WALLET_FX':
        return './wealth-assets/images/deposit/fixed-guid.svg';
      case 'WALLET_GOLD':
        return './wealth-assets/images/deposit/gold-guid.svg';
      default:
        return './wealth-assets/images/deposit/mix-bnpl.svg';
    }
  }
}
