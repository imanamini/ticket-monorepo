import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';

@Component({
  selector: 'app-credit-fund-provider-groups-card-skeleton',
  templateUrl: './credit-fund-provider-groups-card-skeleton.component.html',
  imports: [NgxDividerComponent, NgxSkeletonLoadingComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditFundProviderGroupsCardSkeletonComponent {
  protected readonly BorderColorsEnum = BorderColorsEnum;
}
