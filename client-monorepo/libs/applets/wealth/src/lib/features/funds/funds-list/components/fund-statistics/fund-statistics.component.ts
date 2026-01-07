import { Component, input } from '@angular/core';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { KeyValue, KeyValuePipe, NgClass } from '@angular/common';

import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { IFundList } from 'libs/applets/wealth/src/lib/components/core/models/fund-schemas';

@Component({
  selector: 'app-fund-statistics',
  standalone: true,
  imports: [PipesModule, NgxDividerComponent, KeyValuePipe, NgClass],
  templateUrl: './fund-statistics.component.html',
  styleUrl: './fund-statistics.component.scss',
})
export class FundStatisticsComponent {
  protected readonly BorderColorsEnum = BorderColorsEnum;
  fund = input.required<IFundList>();

  getFundStatistics(): { fundType?: string; expectedProfit?: string; dividendPeriod?: string } {
    if (this.fund().type === 'Index') {
      return {
        expectedProfit: this.fund().expectedProfit,
      };
    }
    return {
      fundType: this.fund().type,
      dividendPeriod: this.fund().dividendPeriod,
    };
  }

  sortStatistic(a: KeyValue<string, any>, b: KeyValue<string, any>): number {
    if (a.key === 'fundType' || b.key === 'fundType') return 1;
    return a.key.localeCompare(b.key);
  }
}
