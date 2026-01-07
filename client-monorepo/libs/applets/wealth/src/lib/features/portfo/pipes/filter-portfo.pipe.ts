import { Pipe, PipeTransform } from '@angular/core';
import { PortfolioDetail } from '../../../data-access/models/portfolio-detail.model';

@Pipe({
  name: 'filterPortfo',
  standalone: true,
})
export class FilterPortfoPipe implements PipeTransform {
  transform(portfo: PortfolioDetail[]): FilteredPortfo {
    return portfo.reduce(
      (acc, asset) => {
        if (asset.type === 'IPO') {
          acc.ipo.push(asset);
        } else if (asset.type === 'Stock') {
          acc.stock.push(asset);
        } else if (asset.investmentType === 'CrowdFund') {
          acc.crowd.push(asset);
        } else {
          acc.fund.push(asset);
        }
        return acc;
      },
      { ipo: [], crowd: [], fund: [], stock: [] } as FilteredPortfo,
    );
  }
}

export interface FilteredPortfo {
  crowd: PortfolioDetail[];
  fund: PortfolioDetail[];
  ipo: PortfolioDetail[];
  stock: PortfolioDetail[];
}
