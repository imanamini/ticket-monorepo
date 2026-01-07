import { NgxIcon } from '@digipay/ngx-icon';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { IWallets } from '../../models/wallet.interface';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { IBar } from '../../../../data-access/models/assets-bar.interface';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { SelectedInventoryType } from '../../models/selected-inventory-type.enum';
import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { AssetsBarComponent } from '../../../../shared/components/assets-bar/assets-bar.component';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { WalletService } from '../../services/wallet.service';
import { IUserActivity } from '../../../../shared/services/activities/models/user-activities.interface';
import { UserActivitiesService } from '../../../../shared/services/activities/user-activities.service';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';
import { IGoldPricePublisher } from '../../models/gold-price-publisher.interface';
import { toSignal } from '@angular/core/rxjs-interop';
@Component({
  standalone: true,
  selector: 'wealth-applet-wallets-balance',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './wallets-balance.component.scss',
  templateUrl: './wallets-balance.component.html',
  imports: [PipesModule, AssetsBarComponent, NgxIcon, NgxDividerComponent, NgClass, NgTemplateOutlet, NgxButtonComponent, NgxSpinnerModule],
})
export class WalletsBalanceComponent {
  wallet = input.required<IWallets>();
  details = computed(() => {
    return this.totalUncollectible() > 0;
  });
  selectedTab = signal<SelectedInventoryType>(SelectedInventoryType.WALLETS_BALANCE);
  walletService = inject(WalletService);
  goldPricePublisher = toSignal<IGoldPricePublisher | null>(this.walletService.goldPricingPublisher$, {
    initialValue: null,
  });
  detaileHandler = output();
  swapHandler = output();

  private goldWallet = computed(() => {
    return this.wallet().wallets.find((x) => x.walletName === 'WALLET_GOLD');
  });

  private fixedWallet = computed(() => {
    return this.wallet().wallets.find((x) => x.walletName === 'WALLET_FX');
  });

  private totalWithdrawal = computed(() => {
    return this.goldWallet().withdrawalBalance + this.fixedWallet()?.withdrawalBalance;
  });

  private totalUncollectible = computed(() => {
    return this.goldWallet().uncollectibleBalance + this.fixedWallet()?.uncollectibleBalance;
  });

  private totalBalance = computed(() => {
    return this.goldWallet().balance + this.fixedWallet()?.balance;
  });

  walletBarConfig = computed<IBar[]>(() => {
    return [
      {
        color: '#FEC003',
        width: parseFloat(((this.goldWallet().balance / this.totalBalance()) * 100).toFixed(1)),
      },
      {
        color: '#00C888',
        width: parseFloat(((this.fixedWallet().balance / this.totalBalance()) * 100).toFixed(1)),
      },
    ];
  });

  collectibleBarConfig = computed<IBar[]>(() => {
    return [
      {
        color: '#3479FF',
        width: parseFloat(((this.totalWithdrawal() / this.totalBalance()) * 100).toFixed(1)),
      },
      {
        color: '#C1C7D5',
        width: parseFloat(((this.totalUncollectible() / this.totalBalance()) * 100).toFixed(1)),
      },
    ];
  });

  inventoryTypeButtons = signal([
    {
      icon: 'money-bag',
      iconType: 'bold',
      value: SelectedInventoryType.WALLETS_BALANCE,
    },
    {
      icon: 'cash-out',
      iconType: 'bold',
      value: SelectedInventoryType.COLLECTIBLE_BALANCE,
    },
  ]);

  walletBalanceInfo = computed(() => {
    const res = [
      {
        title: 'طرح طلا',
        value: this.goldWallet().balance,
        type: 'gold',
        gram: this.goldWallet().weightInGrams,
        color: '#FEC003',
      },
      {
        title: 'طرح درآمد ثابت',
        value: this.fixedWallet().balance,
        type: 'fixed_income',
        gram: 0,
        color: '#00C888',
      },
    ];
    return res;
  });

  collectibleInfo = computed(() => [
    {
      title: 'غیر قابل برداشت',
      value: this.totalUncollectible(),
      color: '#C1C7D5',
    },
    {
      title: 'قابل برداشت',
      value: this.totalWithdrawal(),
      color: '#3479FF',
    },
  ]);

  private userActivitiesService = inject(UserActivitiesService);

  onDetail() {
    this.detaileHandler.emit();
  }

  onSwap() {
    this.swapHandler.emit();
  }

  changeTab(tab: SelectedInventoryType) {
    this.selectedTab.set(tab);

    const activity: IUserActivity = {
      eventId: tab === SelectedInventoryType.WALLETS_BALANCE ? 'WW_TBwith' : 'WW_TBasset',
      payloads: {},
    };
    this.userActivitiesService.action(activity).subscribe();
  }

  protected readonly BorderColorsEnum = BorderColorsEnum;
  protected readonly ESelectedInventoryType = SelectedInventoryType;
}
