import { NgxIcon } from '@digipay/ngx-icon';
import { CommonModule } from '@angular/common';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { RouteStateService } from '@client-monorepo/common/utilities';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { ISuggestionInvestment } from '../../models/suggestion-investment.interface';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { HOME_ROUTE, INVESTMENT_LIST_ROUTE } from '../../../../data-access/constants/app-routes';
import { ICampaignRegistrationState } from '../../models/campaign-registration-state.interface';

@Component({
  selector: 'wealth-applet-campaign-successful',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent, NgxAppBarComponent, NgxIcon],
  templateUrl: './campaign-registration-successful.component.html',
  styleUrl: './campaign-registration-successful.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignRegistrationSuccessfulComponent implements OnInit {
  private routeState = inject(RouteStateService);
  private navigationService = inject(WealthNavigationService);

  state = signal<ICampaignRegistrationState | undefined>(undefined);
  suggestionRoutes = signal<ISuggestionInvestment[]>([
    {
      iconName: 'safe-box',
      title: 'صندوق‌های درامد ثابت',
      type: 'FixedIncome',
    },
    {
      iconName: 'golds',
      title: 'سرمایه‌گذاری مبتنی بر طلا',
      type: 'Gold',
    },
  ]);

  ngOnInit(): void {
    this.state.set(this.routeState.getAll());
    if (!this.state().remainingDays) {
      this.navigationService.navigate([HOME_ROUTE]);
    }
  }

  onBackHandler() {
    this.navigationService.navigate([HOME_ROUTE]);
  }

  onCardClick(type: string) {
    this.navigationService.navigateWithQueryParams([INVESTMENT_LIST_ROUTE], {
      queryParams: { type },
    });
  }
}
