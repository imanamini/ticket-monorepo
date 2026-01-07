import {
  CAMPAIGN_OTP_ROUTE,
  HOME_ROUTE,
  TREASURE_HUNT_NATIONAL_ID_ROUTE,
  TREASURE_HUNT_REGISTRATION_SUCCESSFUL_ROUTE,
} from '../../../../data-access/constants/app-routes';
import { ICompaignState } from '../../models';
import { CommonModule } from '@angular/common';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { RouteStateService } from '@client-monorepo/common/utilities';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { CoordinatorPage } from '../../../../data-access/enums/coordinator-page';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CampaignService } from '../../../../components/core/services/v1/campaign.service';

@Component({
  selector: 'wealth-applet-campaign-start',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent, NgxAppBarComponent],
  templateUrl: './campaign-start.component.html',
  styleUrl: './campaign-start.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignStartComponent implements OnInit {
  routeState = inject(RouteStateService);
  campaignService = inject(CampaignService);
  navigationService = inject(WealthNavigationService);

  state = signal<ICompaignState | undefined>(undefined);

  ngOnInit(): void {
    this.state.set(this.routeState.getAll());
    if (!this.state().campaignCode) this.navigationService.navigate(HOME_ROUTE);
  }

  onBackHandler() {
    this.navigationService.navigate([HOME_ROUTE]);
  }

  toNationalId() {
    this.campaignService.getCampaignProcess(this.state().campaignCode).subscribe((res) => {
      if (res?.success) {
        if (res.result.data.pageName === CoordinatorPage.PAGE_CAMPAIGN_OTP) {
          this.navigationService.navigateWithState([CAMPAIGN_OTP_ROUTE], {
            state: {
              campaignCode: this.state().campaignCode,
              countDown: res.result.data.countdownInSeconds,
            },
          });
        } else if (res.result.data.pageName === CoordinatorPage.PAGE_CAMPAIGN_PRIZE_WAITING) {
          this.navigationService.navigateWithState([TREASURE_HUNT_REGISTRATION_SUCCESSFUL_ROUTE], {
            state: {
              remainingDays: res.result.data.remainingDays,
            },
          });
        } else {
          this.navigationService.navigateWithState([TREASURE_HUNT_NATIONAL_ID_ROUTE], {
            state: {
              campaignCode: this.state().campaignCode,
              phoneNumber: res.result.data.phoneNumber,
              role: this.state().role,
            },
          });
        }
      }
    });
  }
}
