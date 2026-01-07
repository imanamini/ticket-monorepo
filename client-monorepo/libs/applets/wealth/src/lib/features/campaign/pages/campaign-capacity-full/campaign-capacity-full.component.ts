import { CommonModule } from '@angular/common';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { HOME_ROUTE } from '../../../../data-access/constants/app-routes';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ICampaignCapacity } from '../../models';
import { RouteStateService } from '@client-monorepo/common/utilities';

@Component({
  selector: 'wealth-applet-campaign-start',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent, NgxAppBarComponent],
  templateUrl: './campaign-capacity-full.component.html',
  styleUrl: './campaign-capacity-full.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignCapacityFullComponent implements OnInit {
  private routeState = inject(RouteStateService);
  private navigationService = inject(WealthNavigationService);

  state = signal<ICampaignCapacity | undefined>(undefined);

  ngOnInit(): void {
    this.state.set(this.routeState.getAll());
  }

  onBackHandler() {
    this.navigationService.navigate([HOME_ROUTE]);
  }
}
