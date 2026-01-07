import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  HorizontalScrollComponent,
  ItemOverview,
  ItemOverviewComponent,
  TitleSummaryComponent,
} from '@client-monorepo/common/ui-components';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { Action, ActionHandlerService, ActionType } from '@client-monorepo/common/action-handler';
import { PerformanceTierService, rangeCreator, SafePressDirective } from '@client-monorepo/common/utilities';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { Router } from '@angular/router';
import { StorePreviewComponent } from '../store-preview/store-preview.component';
import { Store } from '../../data-access/models/store.type';
import { StoresApiService } from '../../data-access/services/stores-api.service';
import { StoresService } from '../../data-access/services/stores.service';
import { DistancePipe } from '@digipay/ng-lib-pipes';
import { SocialService } from '@client-monorepo/social';
import { SocialStoreEventPrefix } from '@client-monorepo/social';

@Component({
  selector: 'common-stores-all-stores-section',
  standalone: true,
  imports: [
    CommonModule,
    StorePreviewComponent,
    HorizontalScrollComponent,
    TitleSummaryComponent,
    NgxSkeletonLoadingComponent,
    NgxButtonComponent,
    ItemOverviewComponent,
    SafePressDirective,
  ],
  providers: [DistancePipe],
  templateUrl: './all-stores-section.component.html',
  styleUrl: './all-stores-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllStoresSectionComponent implements OnInit {
  storeApi = inject(StoresApiService);
  actionHandler = inject(ActionHandlerService);
  router = inject(Router);
  storesService = inject(StoresService);
  distancePipe = inject(DistancePipe);
  performanceTierService = inject(PerformanceTierService);
  socialService = inject(SocialService);

  isSocialStores = input<boolean>(false);
  selectedStores = input<string[]>([]);
  gaps = input<'normal' | 'extra'>('normal');
  type = input<'large-logo-h' | 'listing' | undefined>('large-logo-h');
  title = input<string | undefined>('فروشگاه‌ها');
  logoStores = signal<Store[][] | undefined>(undefined);
  listingStores = signal<ItemOverview[] | undefined>(undefined);
  secureType = computed<'large-logo-h' | 'listing'>(() => {
    const type = this.type() || 'large-logo-h';
    return ['large-logo-h', 'listing'].includes(type) ? type : 'large-logo-h';
  });
  horizontalScrollClasses = computed(() => 'pr-plus ' + (this.gaps() === 'extra' ? 'gap-big' : ''));
  bestStoresCount = computed(() => (this.isSocialStores() ? 13 : 23));
  maxCount = input(26);
  loadingEffect = computed(() => this.performanceTierService.tier() !== 'low');

  ngOnInit(): void {
    this.getAllStores(this.secureType() === 'large-logo-h');
  }

  getAllStores(shouldBeOdd = false): void {
    if (this.selectedStores()) {
      this.storeApi.getStoresByTitles(this.selectedStores(), 0, this.maxCount()).subscribe({
        next: (data) => {
          if (data.length) {
            let storesCount = data.length;
            if (shouldBeOdd && data.length % 2 === 0) {
              storesCount--;
            }
            this.chunkStores(
              this.sortByTitles(data, this.selectedStores()).slice(
                0,
                this.secureType() === 'large-logo-h' ? Math.min(this.bestStoresCount(), storesCount) : storesCount || this.maxCount(),
              ),
            );
          } else {
            this.getPopularStores();
          }
        },
      });
    } else {
      this.getPopularStores();
    }
  }

  sortByTitles(stores: Store[], titles: string[]): Store[] {
    return stores.sort((a, b) => {
      const indexA = titles.indexOf(a.title);
      const indexB = titles.indexOf(b.title);
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;

      return 0;
    });
  }

  getPopularStores(): void {
    this.storeApi.getPopularStores(0, this.bestStoresCount()).subscribe({
      next: (data) => {
        this.chunkStores(data);
      },
    });
  }

  chunkStores(stores: Store[]): void {
    const grouped: Store[][] = [];
    for (let i = 0; i < stores.length - 1; i += 2) {
      grouped.push([stores[i], stores[i + 1]]);
    }
    grouped.push([stores[stores.length - 1], {} as Store]);
    this.logoStores.set(grouped);
    this.listingStores.set(this.storesService.convertStoreToItemOverView(stores, this.distancePipe, false, undefined, true));
  }

  goToAllStoresPage(): void {
    const action: Action = {
      type: ActionType.REDIRECT,
      payload: {
        url: this.isSocialStores() ? 'stores/social/all-stores' : 'stores/all-stores',
      },
    };

    this.actionHandler.handle(action);
  }

  goToStore(storeTrackingCode: string): void {
    if (this.isSocialStores()) {
      this.socialService.sendClickEvent(SocialStoreEventPrefix + storeTrackingCode);
    }
    this.router.navigate([this.isSocialStores() ? 'stores/social/store' : '/stores', storeTrackingCode]);
  }

  protected readonly rangeCreator = rangeCreator;
}
