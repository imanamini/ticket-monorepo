import { CommonModule } from '@angular/common';
import { ICampaignSuccessful } from '../../models';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { RouteStateService } from '@client-monorepo/common/utilities';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { HOME_ROUTE, INVESTMENT_LIST_ROUTE } from '../../../../data-access/constants/app-routes';

@Component({
  selector: 'wealth-applet-campaign-start',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent, NgxAppBarComponent],
  templateUrl: './campaign-successful.component.html',
  styleUrl: './campaign-successful.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignSuccessfulComponent implements OnInit {
  routeState = inject(RouteStateService);
  navigationService = inject(WealthNavigationService);

  state = signal<ICampaignSuccessful | undefined>(undefined);

  ngOnInit(): void {
    this.state.set(this.routeState.getAll());
    if (!this.state().symbol) {
      this.navigationService.navigate([HOME_ROUTE]);
    }
  }

  onBackHandler() {
    this.navigationService.navigate([HOME_ROUTE]);
  }

  onViewAssets() {
    this.navigationService.navigate([INVESTMENT_LIST_ROUTE, this.state().symbol]);
  }
}
