import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { Store, StoreCategoryTitle, StoreCategoryTitleMapper } from '../../data-access/models/store.type';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { ServiceImagesType } from '@client-monorepo/common/service-data';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { NgxIcon } from '@digipay/ngx-icon';
import { DistancePipe, PipesModule } from '@digipay/ng-lib-pipes';
import { StoreCategoryToIconMapper } from '../../data-access/constants/store-category-mapper';
import { PerformanceTierService } from '@client-monorepo/common/utilities';
import { LogoWithRateComponent } from '../logo-with-rate/logo-with-rate.component';
import { PaymentMethodBadgesComponent } from '../payment-method-badges/payment-method-badges.component';

@Component({
  selector: 'common-stores-store-preview',
  standalone: true,
  imports: [
    CommonModule,
    ApiImageModule,
    NgxSkeletonLoadingComponent,
    NgxBadgeModule,
    NgxIcon,
    PipesModule,
    DistancePipe,
    LogoWithRateComponent,
    PaymentMethodBadgesComponent,
  ],
  templateUrl: './store-preview.component.html',
  styleUrl: './store-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StorePreviewComponent {
  store = input<Store>({} as Store);
  mode = input<'horizontal' | 'vertical-large' | 'vertical-medium' | 'logo-only' | 'with-details'>('vertical-medium');
  isLoading = input(false);
  classes = input<string>('');
  ServiceImagesType = ServiceImagesType;
  StoreCategoryTitleMapper = StoreCategoryTitleMapper;
  StoreCategoryToIconMapper = StoreCategoryToIconMapper;
  storeCategoryTitle = computed(() => {
    if (this.store()?.categories?.length > 0) {
      const title = String(this.store().categories[0]) as StoreCategoryTitle;
      return this.StoreCategoryTitleMapper[title];
    } else {
      return '';
    }
  });
  backgroundMode = input<'elevated' | 'back'>('elevated');
  size = input<'small' | 'large'>('large');
  distance = computed(() => {
    if (this.store() && this.store()?.distance) {
      return Math.ceil(Number(this.store().distance));
    } else return undefined;
  });
  performanceTierService = inject(PerformanceTierService);
  loadingEffect = computed(() => this.performanceTierService.tier() !== 'low');
}
