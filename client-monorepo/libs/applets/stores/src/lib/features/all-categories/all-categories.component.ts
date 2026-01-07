import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemOverview, ItemOverviewComponent, PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { ServiceImagesType } from '@client-monorepo/common/service-data';
import { StoreCategory, StoreCategoryTitleMapper, StoresApiService } from '@client-monorepo/stores';
import { rangeCreator } from '@client-monorepo/common/utilities';
import { Router } from '@angular/router';
import { NgxBottomNavigationService } from '@digipay/ngx-bottom-navigation';

@Component({
  selector: 'stores-applet-all-categories',
  standalone: true,
  imports: [CommonModule, PageLayoutComponent, ItemOverviewComponent],
  templateUrl: './all-categories.component.html',
  styleUrl: './all-categories.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllCategoriesComponent implements OnInit, OnDestroy {
  categories = signal<ItemOverview[] | undefined>(undefined);
  rangeCreator = rangeCreator;
  storesApi = inject(StoresApiService);
  router = inject(Router);

  bottomNavigationService = inject(NgxBottomNavigationService);

  ngOnInit(): void {
    this.getStoresCategories();
    this.bottomNavigationService.hide();
  }

  getStoresCategories(): void {
    this.storesApi.getAllCategories().subscribe({
      next: (res) => this.mapCategoriesToItemOverview(res),
      error: () => this.categories.set([]),
    });
  }

  mapCategoriesToItemOverview(categories: StoreCategory[]): void {
    this.categories.set(
      categories.map((category) => {
        const item: ItemOverview = {
          image: {
            name: category.image,
            type: ServiceImagesType.SRC,
          },
          title: StoreCategoryTitleMapper[category.title],
          subTitleNormal: category.subtitle,
          divider: true,
        };
        return item;
      }),
    );
  }

  gotoFiltersBasedOnCategory(title: string): void {
    const titleFromMapper = Object.keys(StoreCategoryTitleMapper)[Object.values(StoreCategoryTitleMapper).indexOf(title)];
    this.router.navigate(['/stores/all-stores'], { queryParams: { categories: titleFromMapper } });
  }

  ngOnDestroy(): void {
    this.bottomNavigationService.show();
  }
}
