import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CoordinatorPage } from '../../../../data-access/enums/coordinator-page';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, input } from '@angular/core';
import { TreasureHuntCampaignProcess } from '../../../../data-access/models/treasure-hunt.model';
import {
  CAMPAIGN_OTP_ROUTE,
  TREASURE_HUNT_START_ROUTE,
  TREASURE_HUNT_SUCCESSFUL_ROUTE,
  TREASURE_HUNT_NATIONAL_ID_ROUTE,
  TREASURE_HUNT_CAPACITY_FULL_ROUTE,
  TREASURE_HUNT_REGISTRATION_SUCCESSFUL_ROUTE,
} from '../../../../data-access/constants/app-routes';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { CampaignService } from '../../../../components/core/services/v1/campaign.service';

@Component({
  selector: 'wealth-applet-campaigns',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './campaigns.component.html',
  styleUrl: './campaigns.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaginsComponent {
  campaigns = input.required<TreasureHuntCampaignProcess[]>();

  private destroyRef = inject(DestroyRef);
  private campaignService = inject(CampaignService);
  private navigationService = inject(WealthNavigationService);

  onCampaignClick(campaign: TreasureHuntCampaignProcess) {
    this.campaignService
      .getCampaignProcess(campaign.code, 'action=start_journey')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        if (res?.success) {
          this.navigateToCampaignPage(res.result.data, campaign.code);
        }
      });
  }

  private navigateToCampaignPage(data: any, campaignCode: string) {
    switch (data.pageName) {
      case CoordinatorPage.PAGE_CAMPAIGN_CAPACITY_REACHED:
        return this.navigationService.navigate([TREASURE_HUNT_CAPACITY_FULL_ROUTE], {
          state: {
            campaignCode,
            phoneNumber: data.phoneNumber,
          },
        });
      case CoordinatorPage.PAGE_CAMPAIGN_PRIZE_WAITING:
        return this.navigationService.navigate([TREASURE_HUNT_REGISTRATION_SUCCESSFUL_ROUTE], {
          state: { remainingDays: data.remainingDays },
        });
      case CoordinatorPage.PAGE_CAMPAIGN_GUEST_PRIZE_BEGINNING:
        return this.navigationService.navigate([TREASURE_HUNT_START_ROUTE], {
          state: { campaignCode, phoneNumber: data.phoneNumber, role: 'guest' },
        });
      case CoordinatorPage.PAGE_CAMPAIGN_CUSTOMER_PRIZE_BEGINNING:
        return this.navigationService.navigate([TREASURE_HUNT_START_ROUTE], {
          state: { campaignCode, phoneNumber: data.phoneNumber, role: 'customer' },
        });
      case CoordinatorPage.PAGE_CAMPAIGN_PRIZE_RECEIVED:
        return this.navigationService.navigate([TREASURE_HUNT_SUCCESSFUL_ROUTE], {
          state: {
            prizeAmount: data.prizeAmount,
            symbol: data.instrumentSymbol,
            instrumentName: data.instrumentDisplaySymbol,
          },
        });
      case CoordinatorPage.PAGE_CAMPAIGN_OTP:
        return this.navigationService.navigate([CAMPAIGN_OTP_ROUTE], {
          state: { campaignCode, countDown: data.countdownInSeconds },
        });
      default:
        return this.navigationService.navigate([TREASURE_HUNT_NATIONAL_ID_ROUTE]);
    }
  }
}
