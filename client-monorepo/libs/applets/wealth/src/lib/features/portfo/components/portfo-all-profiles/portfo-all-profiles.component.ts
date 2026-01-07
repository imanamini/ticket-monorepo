import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { PipesModule } from '@digipay/ng-lib-pipes';

import { ImageComponent } from '../../../../shared/components/image/image.component';
import { PortfolioDetail } from '../../../../data-access/models/portfolio-detail.model';
import { PORTFO } from '../../../../data-access/constants/app-routes';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { FilterPortfoPipe } from '../../pipes/filter-portfo.pipe';
import { ActivatedRoute, Params } from '@angular/router';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { DecimalPipe } from '@angular/common';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { CustomerService } from '../../../../components/core/services/v1/customer.service';
import { IPortfolio, IPortfolios } from '../../../../components/core/models/customer-schemas/portfolio.interface';
import { NavigationToDetail } from '../../utils/navigation-to-detail';

@Component({
  selector: 'app-portfo-all-profiles',
  standalone: true,
  imports: [ImageComponent, PipesModule, NgxAppBarComponent, DecimalPipe, SpinnerComponent],
  templateUrl: './portfo-all-profiles.component.html',
  styleUrl: './portfo-all-profiles.component.scss',
})
export class PortfoAllProfilesComponent implements OnInit {
  loading = signal(false);
  portfolios = signal<IPortfolios | undefined>(undefined);
  params = signal<Params>({});
  balance = signal<number>(0);
  filteredData = signal<IPortfolio[]>([]);
  filterPortfo = new FilterPortfoPipe();

  title = computed(() => {
    const type = this.params()['type'] as string | undefined;

    switch (type) {
      case 'FixedIncome':
        return 'صندوق‌های درآمد ثابت';
      case 'Gold':
        return 'صندوق‌های طلا';
      case 'CrowdFund':
        return 'تامین مالی جمعی';
      default:
        return '';
    }
  });

  private activatedRoute = inject(ActivatedRoute);
  private customerService = inject(CustomerService);
  private navigationService = inject(WealthNavigationService);
  private navigationToDetail = inject(NavigationToDetail);

  ngOnInit(): void {
    const validParams = ['CrowdFund', 'FixedIncome', 'Gold'];
    this.params.set(this.activatedRoute.snapshot.queryParams);

    const type = this.params()['type'] as string | undefined;

    if (!type || !validParams.includes(type)) {
      this.navigationService.navigate([PORTFO]);
      return;
    }

    this.fetchPortfolio();
  }

  onBackHandler() {
    this.navigationService.navigate([PORTFO]);
  }

  goToDetail(item: PortfolioDetail) {
    this.navigationToDetail.goToDetail(item);
  }

  fetchPortfolio() {
    this.loading.set(true);
    const type = this.params()['type'] as string | undefined;

    if (!type) {
      this.filteredData.set([]);
      this.balance.set(0);
      this.loading.set(false);
      return;
    }

    this.customerService
      .getPortfolios()
      .pipe()
      .subscribe((portfolios) => {
        const matchingPortfolios = portfolios.result.portfolios.filter((x) => x.type === type);
        this.filteredData.set(matchingPortfolios);
        this.balance.set(matchingPortfolios.reduce((acc, value) => acc + value.price, 0));
        this.loading.set(false);
      });
  }
}
