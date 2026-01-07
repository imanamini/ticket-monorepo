import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EventManagementService } from '@client-monorepo/common/event-management';
import { ActionHandlerService, ActionType, RedirectionTypeEnum } from '@client-monorepo/common/action-handler';
import { getHostname, rangeCreator, shuffleArray } from '@client-monorepo/common/utilities';
import { DeferredService } from '../../data-access/services/deferred-service';
import { TitleSummaryComponent } from '@client-monorepo/common/ui-components';
import { OrderTypes, RequestTypeEnum, RestrictionTypes, SearchPayloadInterface } from '@client-monorepo/common/network';
import { forkJoin } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductPreviewComponent } from '../product-preview/product-preview.component';
import { ProductInterface } from '../../data-access/models/product.interface';
import { StoresApiService } from '../../data-access/services/stores-api.service';

@Component({
  selector: 'common-stores-stand-alone-product-list',
  standalone: true,
  imports: [CommonModule, TitleSummaryComponent, ProductPreviewComponent],
  templateUrl: './stand-alone-product-list.component.html',
  styleUrl: './stand-alone-product-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StandAloneProductListComponent implements OnInit {
  title = input('');
  products = signal<ProductInterface[]>([]);
  deferService = inject(DeferredService);
  destroyRef = inject(DestroyRef);

  private readonly storeApi = inject(StoresApiService);
  private readonly router = inject(Router);
  private readonly eventManagement = inject(EventManagementService);
  private readonly actionHandler = inject(ActionHandlerService);

  loadingNewProducts = signal(false);
  productsPageNumber = -1;

  ngOnInit(): void {
    this.loadNewProducts();
    this.subscribeToScrollEnd();
  }

  loadNewProducts(): void {
    this.productsPageNumber++;
    this.loadingNewProducts.set(true);

    const mostVisitedBody: SearchPayloadInterface<string> = {
      orders: [{ field: 'click', order: OrderTypes.DESC }],
      restrictions: [
        {
          field: 'discount',
          type: RestrictionTypes.SIMPLE,
          value: 0,
          operation: 'eq',
        },
      ],
    };

    const discountedBody: SearchPayloadInterface<string> = {
      orders: [{ field: 'discountPercent', order: OrderTypes.DESC }],
      restrictions: [
        {
          field: 'discountPercent',
          type: RestrictionTypes.SIMPLE,
          value: 0,
          operation: 'gt',
        },
      ],
    };

    forkJoin([
      this.storeApi.getProductsBasedOnQuery(
        `app/store/search?page=${this.productsPageNumber}&size=12&available=true`,
        RequestTypeEnum.POST,
        mostVisitedBody,
      ),
      this.storeApi.getProductsBasedOnQuery(
        `app/store/search?page=${this.productsPageNumber}&size=12&available=true`,
        RequestTypeEnum.POST,
        discountedBody,
      ),
    ]).subscribe({
      next: ([mostVisited, discounted]) => {
        const combined = [...mostVisited, ...discounted];
        shuffleArray(combined);
        this.products.update((current) => [...current, ...combined]);
        this.loadingNewProducts.set(false);
      },
      error: () => {
        this.loadingNewProducts.set(false);
      },
    });
  }

  subscribeToScrollEnd(): void {
    this.deferService.scrollEndEvent.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      if (this.productsPageNumber < 4) this.loadNewProducts();
    });
  }

  goToProductPage(product: ProductInterface) {
    this.eventManagement.triggerEvent(
      {
        eventType: 'redirect',
        data: {
          host: getHostname(product.url),
          to: product.url,
        },
        meta: '',
        breadCrumbs: ['infinite-stand-alone', 'product'],
      },
      true,
    );
    this.actionHandler.handle({
      type: ActionType.REDIRECT,
      payload: {
        type: RedirectionTypeEnum.blank,
        url: product.url,
        params: {
          'dp-source': 'DP',
          'dp-medium': 'merchant',
          'dp-type': 'product',
        },
      },
    });
  }

  protected readonly rangeCreator = rangeCreator;
}
