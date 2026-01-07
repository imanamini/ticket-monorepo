import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrderTypes, RestrictionTypes, SearchPayloadInterface } from '@client-monorepo/common/network';
import { Store, StorePreviewComponent, StoreRestrictionFields, StoresApiService } from '@client-monorepo/stores';
import { LayoutService, rangeCreator, ScrolledToEndDirective } from '@client-monorepo/common/utilities';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'stores-applet-store-tag',
  standalone: true,
  imports: [CommonModule, NgxSkeletonLoadingComponent, PageLayoutComponent, ScrolledToEndDirective, RouterLink, StorePreviewComponent],
  templateUrl: './store-tag.component.html',
  styleUrl: './store-tag.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreTagComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  storeApiService = inject(StoresApiService);
  router = inject(Router);
  storesList = signal<Store[]>([]);
  storesLoading = signal<boolean>(false);
  currentPage = signal(0);
  storesEnded = signal<boolean>(false);
  pageSize = 4;
  storeCardsSize = signal<'small' | 'large' | undefined>(undefined);
  rangeCreator = rangeCreator;
  layoutService = inject(LayoutService);
  destroyRef = inject(DestroyRef);

  tag = '';

  ngOnInit() {
    const tag = this.activatedRoute.snapshot.paramMap.get('tag');
    if (tag) {
      this.tag = tag;
      this.getStores();
    }
    this.listenToViewportWidth();
  }

  getStores(): void {
    this.storesLoading.set(true);
    const payload: SearchPayloadInterface<StoreRestrictionFields> = {
      restrictions: [
        {
          type: RestrictionTypes.COLLECTION,
          field: StoreRestrictionFields.TAG,
          values: [this.tag],
          operation: 'eq',
        },
      ],
      orders: [
        {
          order: OrderTypes.ASC,
          field: 'priority',
        },
      ],
    };
    this.storeApiService
      .searchStores(payload, this.currentPage(), this.pageSize)
      .pipe(
        map((res) =>
          res.stores.map((s) => {
            return { ...s, distance: 0 };
          }),
        ),
      )
      .subscribe((res) => {
        this.storesList.update((list) => {
          if (!list) {
            return res;
          } else {
            return list.concat(res);
          }
        });
        this.storesLoading.set(false);
        if (res.length < this.pageSize) {
          this.storesEnded.set(true);
        }
      });
  }

  listEnded() {
    if (this.storesLoading() || this.storesEnded()) {
      return;
    }
    this.currentPage.update((page) => page + 1);
    this.getStores();
  }

  listenToViewportWidth(): void {
    const currentWidth = window.innerWidth;
    this.decideForSize(currentWidth);
    this.layoutService
      .onHorizontalResize()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([_, width]) => {
        this.decideForSize(width);
      });
  }

  decideForSize(width: number): void {
    if (width < 440) {
      this.storeCardsSize.set('small');
    } else {
      this.storeCardsSize.set('large');
    }
  }
}
