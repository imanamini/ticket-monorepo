import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSegmentedControlComponent } from '@digipay/ngx-segmented-control';
import { SegmentItemsModel } from '@digipay/ngx-segmented-control/lib/models/types';
import { WalletGoldPlanYieldDetailsComponent } from '../wallet-gold-plan-yield-details/wallet-gold-plan-yield-details.component';
import { WalletFixedIncomePlanYieldDetailsComponent } from '../wallet-fixed-income-plan-yield-details/wallet-fixed-income-plan-yield-details.component';
import { IAnnualProfit } from '../../models/annual-profit.interface';
import { IWallet } from '../../models/wallet.interface';
import { IUserActivity } from '../../../../shared/services/activities/models/user-activities.interface';
import { UserActivitiesService } from '../../../../shared/services/activities/user-activities.service';

@Component({
  selector: 'wealth-applet-wallet-yield-details',
  standalone: true,
  imports: [CommonModule, NgxSegmentedControlComponent, WalletGoldPlanYieldDetailsComponent, WalletFixedIncomePlanYieldDetailsComponent],
  templateUrl: './wallet-yield-details.component.html',
  styleUrl: './wallet-yield-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletYieldDetailsComponent {
  wallet = input.required<IWallet[]>();
  skeleton = input.required<boolean>();
  annualProfit = input<IAnnualProfit>();
  selectedTab: string | number = 0;

  fxWallet = computed(() => {
    return this.wallet().find((x) => x.walletName === 'WALLET_FX');
  });

  goldWallet = computed(() => {
    return this.wallet().find((x) => x.walletName === 'WALLET_GOLD');
  });

  tabOptions = computed<SegmentItemsModel[]>(() => {
    const opt = this.wallet().map((wallet, index) => {
      return {
        text: wallet.title,
        id: index,
        value: wallet.walletName,
      };
    });
    return opt;
  });

  private userActivitiesService = inject(UserActivitiesService);

  updateTab(tabId: string | number) {
    const activity: IUserActivity = {
      eventId: tabId === 0 ? 'WW_REfix' : 'WW_REgold',
      payloads: {},
    };
    this.userActivitiesService.action(activity).subscribe();
    this.selectedTab = tabId;
  }
}
