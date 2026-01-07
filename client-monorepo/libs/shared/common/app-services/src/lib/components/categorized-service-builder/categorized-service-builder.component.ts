import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { AppServiceCategoryInterface, FrequentServiceInterface } from '@client-monorepo/common/service-data';
import { FramedIconComponent, HorizontalScrollComponent, TitleSummaryComponent } from '@client-monorepo/common/ui-components';
import { ServiceImagesType } from '@client-monorepo/common/service-data';
import { rangeCreator } from '@client-monorepo/common/utilities';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import {
  CategorizedServiceItemBillInterface,
  CategorizedServiceItemInterface,
  CategorizedServiceItemServiceInterface,
} from '../../data-access/models/categorized-service-item.interface';
import { RecommendedBillTypeInterface } from '../../data-access/models/recommended-bill-type.interface';
import { NgxRouterLoadingDirective } from '@digipay/ngx-router-loading';

@Component({
  selector: 'common-app-services-categorized-service-builder',
  standalone: true,
  imports: [TitleSummaryComponent, FramedIconComponent, HorizontalScrollComponent, NgxSkeletonLoadingComponent, NgxRouterLoadingDirective],
  templateUrl: './categorized-service-builder.component.html',
  styleUrl: './categorized-service-builder.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategorizedServiceBuilderComponent {
  category = input.required<AppServiceCategoryInterface>();
  services = input<Array<FrequentServiceInterface>>([]);
  clickOnService = output<CategorizedServiceItemInterface>();
  isLoading = input<boolean>(false);
  itemsToShow = input<number | null>(null);
  hasTitle = input(true);
  iconSize = input<'XS' | 'SMALL' | 'MEDIUM' | 'LARGE' | 56 | 64 | 40>(64);
  showBadge = input(true);
  insideServiceMode = input(false);
  iconColor = input<string>('#4657C3');
  bg = input<'surface-back' | 'surface-elevated' | 'surface-glass-onelevated'>('surface-back');
  sliderMode = computed(() => {
    return this.itemsToShow() === null || this.itemsToShow()! > 4;
  });
  doFilter = input<boolean>(true);
  serviceType = input<'service' | 'bill'>('service');
  bills = input<Array<RecommendedBillTypeInterface>>([]);
  filteredServices = computed<Array<CategorizedServiceItemInterface>>(() => {
    const limitValue = this.itemsToShow();
    let filtered: Array<CategorizedServiceItemInterface> = [];
    if (this.serviceType() === 'service' && this.services() && this.services().length) {
      filtered = this.services()
        .filter((service) => {
          if (this.doFilter()) {
            return this.serviceType() === 'service' && 'categories' in service && service.categories
              ? service.categories.some((cat) => cat.name === this.category().name)
              : false;
          } else {
            return true;
          }
        })
        .map((service) => ({ type: 'service', data: { ...service, selected: false } }) as CategorizedServiceItemServiceInterface);
    }
    if (this.serviceType() === 'bill' && this.bills() && this.bills().length) {
      return this.bills().map(
        (bill) =>
          ({
            type: 'bill',
            data: { ...bill, icon: bill.imageId, selected: false, badge: undefined },
          }) as CategorizedServiceItemBillInterface,
      );
    }
    return typeof limitValue === 'number' && limitValue > 0 ? filtered.slice(0, limitValue) : filtered;
  });
  handleClickOnService(service: CategorizedServiceItemInterface): void {
    this.clickOnService.emit(service);
  }

  protected readonly ServiceImagesType = ServiceImagesType;
  protected readonly rangeCreator = rangeCreator;
}
