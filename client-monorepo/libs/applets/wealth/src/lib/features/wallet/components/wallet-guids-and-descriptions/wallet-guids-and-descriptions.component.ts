import { NgxIcon } from '@digipay/ngx-icon';
import { CommonModule } from '@angular/common';
import { WALLET_GUIDS } from '../../../../data-access/constants/app-routes';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { UserActivitiesService } from '../../../../shared/services/activities/user-activities.service';
import { IUserActivity } from '../../../../shared/services/activities/models/user-activities.interface';

@Component({
  selector: 'wealth-applet-wallet-guids-and-descriptions',
  standalone: true,
  imports: [CommonModule, NgxIcon],
  templateUrl: './wallet-guids-and-descriptions.component.html',
  styleUrl: './wallet-guids-and-descriptions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletGuidsAndDescriptionsComponent {
  walletId = input.required<string>();
  private navigationService = inject(WealthNavigationService);
  private userActivityService = inject(UserActivitiesService);

  hintsList = signal([
    {
      icon: '/wealth-assets/images/guids/purchase-guid.svg',
      title: 'دریافت اعتبار اقساطی',
      route: 'purchase-credit',
    },
    {
      icon: '/wealth-assets/images/guids/gold-guid.svg',
      title: 'طرح طلا',
      route: 'gold-plan',
    },
    {
      icon: '/wealth-assets/images/guids/fixed-guid.svg',
      title: 'طرح درامد ثابت',
      route: 'fixed-income',
    },
  ]);

  handleClick(route: string) {
    const eventId = route === 'purchase-credit' ? 'WW_GUcredit' : route === 'gold-plan' ? 'WW_UGgold' : 'WW_UGfix';
    const activity: IUserActivity = {
      eventId: eventId,
      payloads: {},
    };
    this.userActivityService.action(activity).subscribe();
    this.navigationService.navigate([WALLET_GUIDS, route, this.walletId()]);
  }
}
