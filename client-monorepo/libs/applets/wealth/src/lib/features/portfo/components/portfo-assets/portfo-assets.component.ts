import { NgxIcon } from '@digipay/ngx-icon';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { MetersPipe } from '../../pipes/meters.pipe';
import { IMeter } from '../../models/meter.interface';
import { DecimalPipe, NgClass } from '@angular/common';
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { IPortfolios } from '../../../../components/core/models/customer-schemas/portfolio.interface';
import { DonutChartComponent } from '../../../../shared/components/donut-chart/donut-chart.component';
import { ALLPROFILES, CROWD_LIST_ROUTE, INVESTMENT_LIST_ROUTE, WALLETS_ROUTE } from '../../../../data-access/constants/app-routes';

@Component({
  selector: 'app-portfo-assets',
  standalone: true,
  imports: [DecimalPipe, DonutChartComponent, NgxDividerComponent, PipesModule, NgxIcon, NgClass],
  templateUrl: './portfo-assets.component.html',
  styleUrl: './portfo-assets.component.scss',
})
export class PortfoAssetsComponent implements OnInit {
  assets = input<IPortfolios>();
  chartData = signal<number[]>([]);
  preferredColors = signal<string[]>([]);

  meterData = signal<IMeter[]>([]);
  meters = new MetersPipe();

  private navigationService = inject(WealthNavigationService);
  protected readonly BorderColorsEnum = BorderColorsEnum;

  ngOnInit(): void {
    if (this.assets()) {
      this.meterData.set(this.meters.transform(this.assets().balance, this.assets().portfolios));
      this.meterData().forEach((item) => {
        if (item.price > 0) {
          this.chartData().push(item.percent);
          this.preferredColors().push(item.color);
        }
      });
    }
    if (this.chartData().length <= 0) {
      this.chartData().push(100);
      this.preferredColors().push('#F2F3F6');
    }
  }

  handleRedirect(meter: IMeter) {
    if (!meter.price || meter.price <= 0) {
      switch (meter.type) {
        case 'CrowdFund':
          this.navigationService.navigate([CROWD_LIST_ROUTE]);
          break;
        case 'Wallet':
          this.navigationService.navigate([WALLETS_ROUTE, meter.symbol]);
          break;
        default:
          this.navigationService.navigate([INVESTMENT_LIST_ROUTE], {
            queryParams: {
              type: meter.type,
            },
          });
          break;
      }
    } else {
      if (meter.type === 'Wallet') {
        this.navigationService.navigate([WALLETS_ROUTE, meter.symbol]);
      } else {
        this.navigationService.navigate([ALLPROFILES], {
          queryParams: {
            type: meter.type,
          },
        });
      }
    }
  }
}
