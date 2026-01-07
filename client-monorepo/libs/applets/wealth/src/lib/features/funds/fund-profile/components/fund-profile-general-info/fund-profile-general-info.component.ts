import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxTooltipDirective } from '@digipay/ngx-tooltip';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { FundsType, IFundDetail } from 'libs/applets/wealth/src/lib/components/core/models/fund-schemas';
import { IProfileGeneralInfo } from '../../models/fund-profit-detail.interface';
import { FundTypeLabelMap } from '../../models';

@Component({
  selector: 'app-fund-profile-general-info',
  standalone: true,
  imports: [PipesModule, NgxButtonComponent, NgxTooltipDirective, NgxDividerComponent, NgClass],
  templateUrl: './fund-profile-general-info.component.html',
  styleUrl: './fund-profile-general-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FundProfileGeneralInfoComponent {
  private readonly fundTypeLabelMap = FundTypeLabelMap;
  protected readonly BorderColorsEnum = BorderColorsEnum;

  fund = input.required<IFundDetail>();
  info = computed<IProfileGeneralInfo[]>(() => {
    const fund = this.fund();
    if (!fund) return [];

    const fundType = fund.type;
    const investmentType = fund.investmentType === 'Mutual' ? 'صدور/ابطالی' : 'قابل معامله';
    const fundTypeLabel = fundType != null ? (this.fundTypeLabelMap[fundType] ?? fundType) : undefined;

    const items: IProfileGeneralInfo[] = [];

    if (fundTypeLabel) {
      items.push({
        key: 'type',
        title: 'نوع صندوق',
        value: `${investmentType}-${fundTypeLabel}`,
        fundType: fundType as FundsType,
      });
    }

    if (fund.netAsset != null) {
      items.push({
        key: 'netAsset',
        title: 'خالص ارزش دارایی صندوق',
        value: fund.netAsset,
        fundType: fundType as FundsType,
      });
    }

    if (fund.website) {
      items.push({
        key: 'website',
        title: 'وبسایت صندوق',
        value: fund.website,
        fundType: fundType as FundsType,
      });
    }

    if (fund.statisticNav != null) {
      items.push({
        key: 'statisticNav',
        title: 'قیمت آماری',
        value: fund.statisticNav,
        fundType: fundType as FundsType,
      });
    }

    return items;
  });
}
