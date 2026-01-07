import { PipesModule } from '@digipay/ng-lib-pipes';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormatedDate } from '../../../../../shared/pipes/formated-date.pipe';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { IFundDetail } from 'libs/applets/wealth/src/lib/components/core/models/fund-schemas';

@Component({
  selector: 'app-fund-profile-price-card',
  standalone: true,
  imports: [PipesModule, FormatedDate, NgxDividerComponent],
  templateUrl: './fund-profile-price-card.component.html',
  styleUrl: './fund-profile-price-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FundProfilePriceCardComponent {
  profile = input.required<IFundDetail>();
  protected readonly BorderColorsEnum = BorderColorsEnum;
}
