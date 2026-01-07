import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { DecimalPipe, NgClass } from '@angular/common';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';
import { IPortfolio } from 'libs/applets/wealth/src/lib/components/core/models/customer-schemas/portfolio.interface';

@Component({
  selector: 'app-fund-profile-user-assets',
  standalone: true,
  imports: [PipesModule, DecimalPipe, NgClass, NgxSpinnerModule],
  templateUrl: './fund-profile-user-assets.component.html',
  styleUrl: './fund-profile-user-assets.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FundProfileUserAssetsComponent {
  portfolio = input.required<IPortfolio>();
  isLoading = input<boolean>();
}
