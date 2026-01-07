import { inject, Injectable, signal } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { ProductInterface, StorePaymentMethod } from '@client-monorepo/stores';
import { ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { Coordination, LocationService } from '@client-monorepo/common/location-management';
import { OkalaCarousel, OkalaProduct, OkalaSubCarousels } from '../models/okala.model';
import { generateUUID } from '@client-monorepo/common/utilities';

@Injectable({
  providedIn: 'root',
})
export class OkalaService {
  private mirrorBaseUrl = 'app/dpx/mirror/';
  private luciferApiUrl = 'okala-lucifer';
  private promotionApiUrl = 'okala-promotion?pageTypeLatinName=HomePage';
  promotionSingleStoreApiUrl = 'okala-promotion-single-store?HasQuantity=true&Page=1&Take=16&storeId=7058&excludeShoppingCard=true';
  promotionMultiStoreApiUrl = 'okala-promotion-multi-store';

  apiService = inject(ApiService);
  nearByStoreId = signal<number[]>([]);
  nearByCarousels = signal<OkalaCarousel[]>([]);
  nearByCarouselsCount = signal<number>(0);
  locationService = inject(LocationService);

  sessionId = generateUUID();

  getNearbyStores(coordination: Coordination): Observable<{ data: { stores: [{ storeId: number }] } }> {
    const finalUrl = `${this.mirrorBaseUrl}${this.luciferApiUrl}?latitude=${coordination.latitude}&longitude=${coordination.longitude}`;
    const request = new RequestBuilder(RequestTypeEnum.GET, finalUrl).setHeader({ 'session-id': this.sessionId });
    return this.apiService.call<{ data: { stores: [{ storeId: number }] } }>(request);
  }

  getCarousels(): Observable<{ carousels: OkalaCarousel[] }> {
    const url = this.createCarouselApi();
    const request = new RequestBuilder(RequestTypeEnum.GET, url).setHeader({ 'session-id': this.sessionId });
    return this.apiService.call<{ carousels: OkalaCarousel[] }>(request);
  }

  getSingleCarousel(carouselId: number): Observable<{ carousel: { title: string } }> {
    const url = this.mirrorBaseUrl + this.promotionSingleStoreApiUrl + '&CarouselId=' + carouselId;
    const request = new RequestBuilder(RequestTypeEnum.GET, url).setHeader({ 'session-id': this.sessionId });
    return this.apiService.call<{ carousel: { title: string } }>(request);
  }

  getSubCarousels(carouselId: number): Observable<OkalaSubCarousels> {
    let url = this.mirrorBaseUrl + this.promotionMultiStoreApiUrl + '?carouselId=' + carouselId;
    if (this.nearByStoreId().length > 0) {
      this.nearByStoreId().forEach((storeId: number) => {
        url += `&StoreIds=${storeId}`;
      });
      const request = new RequestBuilder(RequestTypeEnum.GET, url);
      return this.apiService.call<OkalaSubCarousels>(request);
    } else {
      return this.locationService.getGuaranteedLocation().pipe(
        switchMap((location) => {
          return this.getNearbyStores(location.coordination).pipe(
            switchMap((data) => {
              data.data.stores.forEach((store) => {
                url += `&StoreIds=${store.storeId}`;
              });
              const request = new RequestBuilder(RequestTypeEnum.GET, url).setHeader({ 'session-id': this.sessionId });
              return this.apiService.call<OkalaSubCarousels>(request);
            }),
          );
        }),
      );
    }
  }

  createCarouselApi(): string {
    return this.addStoreIdsToUrl(this.mirrorBaseUrl + this.promotionApiUrl);
  }

  addStoreIdsToUrl(url: string): string {
    this.nearByStoreId().forEach((storeId: number) => {
      url += `&storeIds=${storeId}`;
    });
    return url;
  }

  mapOkalaProductsToOurProducts(okalaProducts: OkalaProduct[] | undefined): ProductInterface[] {
    if (!okalaProducts) {
      return [];
    }
    const products: ProductInterface[] = [];
    for (const okalaProduct of okalaProducts) {
      products.push({
        externalId: okalaProduct.id,
        title: okalaProduct.name,
        url: '',
        documentId: '',
        hostName: '',
        price: Number(okalaProduct.okPrice / 10).toString(),
        previousPrice: Number(okalaProduct.price / 10).toString(),
        discountPercent: okalaProduct.discountPercent,
        mainCategory: '',
        categories: undefined,
        image: okalaProduct.imageUrl,
        storeLogoImageId: undefined,
        storeName: okalaProduct.storeName,
        storePaymentMethods: [StorePaymentMethod.BNPL, StorePaymentMethod.C_CREDIT],
      });
    }
    return products;
  }
}
