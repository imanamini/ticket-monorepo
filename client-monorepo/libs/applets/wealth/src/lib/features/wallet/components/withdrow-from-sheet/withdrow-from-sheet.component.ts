import { NgxIcon } from '@digipay/ngx-icon';
import { CommonModule } from '@angular/common';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { IWallet } from '../../models/wallet.interface';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';
import { UserActivitiesService } from '../../../../shared/services/activities/user-activities.service';
import { WALLET_WITHDROW_PROCESS_API } from '../../../../data-access/constants/api';
import { WalletService } from '../../services/wallet.service';
import { finalize } from 'rxjs';
import { IWalletProcessData } from '../../models/wallet-process.interface';

@Component({
  selector: 'wealth-applet-withdrow-from-sheet',
  standalone: true,
  imports: [CommonModule, NgxIcon, PipesModule, NgxSpinnerModule],
  templateUrl: './withdrow-from-sheet.component.html',
  styleUrl: './withdrow-from-sheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WithdrowFromSheetComponent implements OnInit {
  wallets = signal<IWallet[] | undefined>(undefined);
  walletId: string;
  loadingWallet = signal<string | null>(null);

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
        action: 'start_journey',
        data: {
          walletName: wallet.walletName,
          walletId: this.walletId.toLowerCase(),
        },
      };

      const activity = {
        eventId: wallet.walletName === 'WALLET_FX' ? 'WW_WithFix' : 'WW_WithGold',
        payloads: { walletId: this.walletId || '' },
      };
      this.userActivitiesService.action(activity).subscribe();
      this.walletService
        .walletProcess(WALLET_WITHDROW_PROCESS_API, processData)
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
    }
  }
}
