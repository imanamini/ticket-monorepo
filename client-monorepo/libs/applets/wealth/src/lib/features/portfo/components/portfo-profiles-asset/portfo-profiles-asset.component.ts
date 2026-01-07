import { Component, inject, Input, input, OnInit } from '@angular/core';
import { NgxIcon } from '@digipay/ngx-icon';
import { DecimalPipe, NgTemplateOutlet, SlicePipe } from '@angular/common';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { ImageComponent } from '../../../../shared/components/image/image.component';
import { FormatedDate } from '../../../../shared/pipes/formated-date.pipe';
import { PortfolioDetail } from '../../../../data-access/models/portfolio-detail.model';
import { ALLPROFILES, INVESTMENT_LIST_ROUTE } from '../../../../data-access/constants/app-routes';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { FilteredPortfo, FilterPortfoPipe } from '../../pipes/filter-portfo.pipe';
import { NavigationToDetail } from '../../utils/navigation-to-detail';

@Component({
  selector: 'app-portfo-profiles-asset',
  standalone: true,
  imports: [NgxIcon, ImageComponent, DecimalPipe, PipesModule, SlicePipe, FormatedDate, NgTemplateOutlet],
  templateUrl: './portfo-profiles-asset.component.html',
  styleUrl: './portfo-profiles-asset.component.scss',
})
export class PortfoProfilesAssetComponent implements OnInit {
  @Input() assetData: PortfolioDetail[];
  balance = input<number>(0);
  crowdBalance = input<number>(0);
  ipoBalance = input<number>(0);
  stockBalance = input<number>(0);
  canSee = input.required<boolean>();
  private navigationService = inject(WealthNavigationService);
  private navigationToDetail = inject(NavigationToDetail);

  filterPortfo = new FilterPortfoPipe();
  assets: FilteredPortfo = { crowd: [], fund: [], ipo: [], stock: [] };

  ngOnInit() {
    this.assets = this.filterPortfo.transform(this.assetData);
  }

  goToProfile() {
    this.navigationService.navigate([INVESTMENT_LIST_ROUTE]);
  }

  goToMore(type) {
    this.navigationService.navigate([ALLPROFILES], {
      queryParams: { type },
    });
  }

  goToDetail(item: PortfolioDetail) {
    this.navigationToDetail.goToDetail(item);
  }
}
