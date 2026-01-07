import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { IWallet } from '../../models/wallet.interface';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { WalletService } from '../../services/wallet.service';

@Component({
  selector: 'wealth-applet-wallets-balance-sheet',
  standalone: true,
  imports: [CommonModule, NgxDividerComponent, PipesModule, NgxButtonComponent],
  templateUrl: './wallets-balance-sheet.component.html',
  styleUrl: './wallets-balance-sheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletsBalanceSheetComponent implements OnInit {
  wallets = signal<IWallet[] | undefined>(undefined);
  goldBar = signal<number>(0);
  goldBalance = signal<number>(0);
  goldUncollectibleBalance = signal<number>(0);
  goldWithdrawalBalance = signal<number>(0);

  private goldWallet = computed(() => {
    return this.wallets().find((x) => x.walletName === 'WALLET_GOLD');
  });

  private fixedWallet = computed(() => {
    return this.wallets().find((x) => x.walletName === 'WALLET_FX');
  });

  walletsBalanceInfo = computed(() => [
    {
      walletName: this.fixedWallet().title,
      totalBalance: this.fixedWallet().balance,
      color: '#57D176',
      detailBalance: [
        {
          title: 'غیر قابل برداشت',
          value: this.fixedWallet().uncollectibleBalance,
          color: '#C1C7D5',
        },
        {
          title: 'قابل برداشت',
          value: this.fixedWallet().withdrawalBalance,
          color: '#3479FF',
        },
      ],
      bar: {
        color: '#3479FF',
        width: parseFloat(((this.fixedWallet().withdrawalBalance / this.fixedWallet().balance) * 100).toFixed(1)),
      },
    },
    {
      walletName: this.goldWallet().title,
      totalBalance: this.goldBalance(),
      color: '#FEC003',
      detailBalance: [
        {
          title: 'غیر قابل برداشت',
          value: this.goldUncollectibleBalance(),
          color: '#C1C7D5',
        },
        {
          title: 'قابل برداشت',
          value: this.goldWithdrawalBalance(),
          color: '#3479FF',
        },
      ],
      bar: {
        color: '#3479FF',
        width: this.goldBar(),
      },
    },
  ]);

  private walletService = inject(WalletService);
  private bottomSheetService = inject(NgxBottomSheetService);
  protected readonly BorderColorsEnum = BorderColorsEnum;

  ngOnInit(): void {
    this.wallets.set(this.bottomSheetService.data().wallets);
    this.getGoldBalance();
  }

  private getGoldBalance() {
    this.walletService.goldPricingPublisher$.subscribe((res) => {
      this.goldBalance.set(res?.balance);
      this.goldWithdrawalBalance.set(res?.withdrawalBalance);
      this.goldUncollectibleBalance.set(res?.uncollectibleBalance);
      this.calculateGoldBar();
    });
  }

  private calculateGoldBar() {
    this.goldBar.set(parseFloat(((this.goldWallet().withdrawalBalance / this.goldBalance()) * 100).toFixed(1)));
  }

  onClose() {
    this.bottomSheetService.closeBottomSheet();
  }
}
