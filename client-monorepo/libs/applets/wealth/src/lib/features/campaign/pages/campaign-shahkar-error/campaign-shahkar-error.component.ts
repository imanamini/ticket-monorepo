import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { RouteStateService } from '@client-monorepo/common/utilities';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { WALLETS_ROUTE } from '../../../../data-access/constants/app-routes';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ICampaignShahkarState } from '../../models';

@Component({
  selector: 'app-campaign-shahkar-error',
  templateUrl: './campaign-shahkar-error.component.html',
  styleUrls: ['./campaign-shahkar-error.component.scss'],
  standalone: true,
  imports: [NgxButtonComponent, NgxAppBarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignShahkarErrorComponent implements OnInit {
  private routeState = inject(RouteStateService);
  private navigationService = inject(WealthNavigationService);

  state = signal<ICampaignShahkarState | undefined>(undefined);

  ngOnInit(): void {
    this.state.set(this.routeState.getAll());
  }

  onBackHandler() {
    if (this.state()?.walletName) {
      this.navigationService.navigate([WALLETS_ROUTE, this.state()?.walletId.toLowerCase()]);
    } else {
      window.history.back();
    }
  }
}
