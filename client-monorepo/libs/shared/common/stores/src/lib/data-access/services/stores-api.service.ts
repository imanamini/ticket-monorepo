import { computed, Inject, inject, Injectable } from '@angular/core';
import { map, noop, Observable } from 'rxjs';
import { BranchSearchApiResponse, StoreSearchApiResponse } from '../models/store-search-api-response';

import { ProductSearchApiResponse } from '../models/product-search-api-response';
import {
  ApiResultInterface,
  ApiService,
  OrderTypes,
  RequestBuilder,
  RequestTypeEnum,
  Restriction,
  RestrictionTypes,
  SearchPayloadInterface,
} from '@client-monorepo/common/network';
import { StoreDefaultRestriction, VouchersDefaultRestriction } from '../models/stores-filters.model';
import { SearchBranchesBodyModel } from '../models/search-branches-body.model';
import { SearchBranchesResponseModel } from '../models/search-branches-response.model';
import { Coordination, LocationService } from '@client-monorepo/common/location-management';
import { VoucherResponseModel, VouchersRestrictionFields } from '@client-monorepo/vouchers';
import { storeCategories, StoreRestrictionFields } from '../constants/stores.const';
import { ProductApiService } from './product-api.service';
import { Store, StoreCategory, StoreCategoryTitle, StoreSort } from '../models/store.type';
import { ProductInterface } from '../models/product.interface';
import { ProductListResponseInterface } from '../models/product-list-response.interface';
import { BranchDefaultRestriction, BranchesRestrictionFields } from '../constants/branches.const';
import { SearchVouchersBodyModel } from '../models/search-vouchers-body.model';
import { StoreSearchBranchesConfig } from '../models/store-search-branches-config';
import { ViolationRequestBody } from '../models/violation.model';

@Injectable({
  providedIn: 'root',
})
export class StoresApiService {
  storeDefaultRestriction = StoreDefaultRestriction;
  apiService = inject(ApiService);
  productService = inject(ProductApiService);
  baseSearchUrl = 'app/store/stores/search';
  locationService = inject(LocationService);
  location = computed<Coordination | undefined>(() => {
    if (this.locationService.lastLocation() && (this.locationService.lastLocation()?.timestamp || 0) > Date.now() - 1000 * 60 * 120) {
      return this.locationService.lastLocation();
    }
    return this.locationService.defaultLocation;
  });

  constructor(@Inject('APP_ENV') private environment: { [key: string]: string }) {}

  getAllStores(payload: SearchPayloadInterface<StoreRestrictionFields> | undefined = undefined, size = 20): Observable<Store[]> {
    if (payload) {
      payload.restrictions = [...payload.restrictions, this.storeDefaultRestriction];
    } else {
      payload = {
        restrictions: [this.storeDefaultRestriction],
        orders: [],
      };
    }
    const page = payload.page || 0;
    const calculatedSize = payload.size || size;
    let query = `?page=${page}&size=${calculatedSize}`;
    if (this.location()) {
      query += `&latitude=${this.location()?.latitude}&longitude=${this.location()?.longitude}`;
    }
    const request = new RequestBuilder(RequestTypeEnum.POST, this.baseSearchUrl + query, payload);
    return this.apiService.call<StoreSearchApiResponse>(request).pipe(map((res) => res.stores));
  }

  searchStores(
    body: SearchPayloadInterface<StoreRestrictionFields>,
    page = 0,
    size = 20,
    count = false,
  ): Observable<StoreSearchApiResponse> {
    body.restrictions = [...body.restrictions, this.storeDefaultRestriction];
    if (body.orders.length === 0) {
      body.orders = [
        { field: StoreSort.PRIORITY, order: OrderTypes.ASC },
        { field: 'trackingCode', order: OrderTypes.ASC },
      ];
    }
    const params = ['?page=', String(page), '&size=', String(size), count ? '&count=true' : ''];
    params.push('&latitude=', String(this.location()?.latitude), '&longitude=', String(this.location()?.longitude));
    let request = new RequestBuilder(RequestTypeEnum.POST, this.baseSearchUrl + params.join(''), body ? body : {});
    request = request.enableCache(30 * 1000);
    return this.apiService.call(request);
  }

  private getStoreBasedOnCollectionField(
    field: StoreRestrictionFields,
    value: any,
    page = 0,
    size = 20,
    orders: any[] = [{ field: StoreSort.PRIORITY, order: OrderTypes.ASC }],
  ): Observable<StoreSearchApiResponse> {
    const restrictions: Restriction<StoreRestrictionFields>[] = [
      {
        type: RestrictionTypes.COLLECTION,
        field,
        operation: 'eq',
        values: [value],
      },
      this.storeDefaultRestriction,
    ];
    const request = new RequestBuilder(RequestTypeEnum.POST, this.baseSearchUrl + '?page=' + page + '&size=' + size, {
      restrictions: restrictions,
      orders: orders,
    }).enableCache(5 * 1000 * 60);
    return this.apiService.call(request);
  }

  getStore(value: string, field: StoreRestrictionFields = StoreRestrictionFields.TITLE): Observable<Store | undefined> {
    const payload: SearchPayloadInterface<StoreRestrictionFields> = {
      restrictions: [
        {
          type: RestrictionTypes.SIMPLE,
          field,
          value,
          operation: 'eq',
        },
      ],
      orders: [],
    };
    const request = new RequestBuilder(RequestTypeEnum.POST, this.baseSearchUrl, payload);
    return this.apiService.call<StoreSearchApiResponse>(request).pipe(
      map((res) => res.stores),
      map((stores: Store[]) => stores[0]),
    );
  }

  getAllCategories(): Observable<StoreCategory[]> {
    const allCategories = storeCategories;
    return new Observable((observer) => {
      observer.next(allCategories);
    });
  }

  getStoreProducts(website: string, keyword = '', page = 0, size = 10): Observable<ProductSearchApiResponse> {
    let url = `app/store/search?page=${page}&size=${size}&host=${website}&available=true`;
    url = keyword === '' ? url : url + '&keyword=' + keyword;
    const request = new RequestBuilder(RequestTypeEnum.GET, url);
    return this.apiService.call<ProductSearchApiResponse>(request);
  }

  getProductsBasedOnQuery(query: string, method = RequestTypeEnum.GET, body: any = undefined): Observable<ProductInterface[]> {
    const request =
      method === RequestTypeEnum.GET
        ? new RequestBuilder(RequestTypeEnum.GET, query)
        : new RequestBuilder(RequestTypeEnum.POST, query, body);
    return this.apiService
      .call<ProductInterface[]>(request)
      .pipe(
        map((response: any) => {
          this.productService.setPriceFacet(response as ProductListResponseInterface);
          return response;
        }),
      )
      .pipe(map((res: any) => (res.items ? res.items.map((i: { product: ProductInterface }) => i.product) : res.products)));
  }

  getPopularStores(page = 0, size = 10): Observable<Array<Store>> {
    const payload: SearchPayloadInterface<StoreRestrictionFields> = {
      restrictions: [],
      orders: [
        {
          order: OrderTypes.ASC,
          field: 'priority',
        },
      ],
      page,
      size,
    };
    return this.getAllStores(payload);
  }

  getStoresByTitles(titles: string[], page = 0, size = 10): Observable<Array<Store>> {
    const payload: SearchPayloadInterface<StoreRestrictionFields> = {
      restrictions: [{ type: RestrictionTypes.COLLECTION, field: StoreRestrictionFields.TITLE, values: titles }],
      orders: [
        {
          order: OrderTypes.ASC,
          field: 'priority',
        },
      ],
      page,
      size,
    };
    return this.getAllStores(payload);
  }

  searchBranches(config: StoreSearchBranchesConfig): Observable<SearchBranchesResponseModel> {
    const restrictions: any[] = [BranchDefaultRestriction];
    if (config.storeTrackingCode) {
      restrictions.push({
        type: RestrictionTypes.SIMPLE,
        field: BranchesRestrictionFields.STORE_TRACKING_CODE,
        value: config.storeTrackingCode,
        operation: 'eq',
      });
    }
    if (config.storeCategories && config?.storeCategories?.length > 0) {
      restrictions.push({
        type: RestrictionTypes.COLLECTION,
        field: BranchesRestrictionFields.STORE_CATEGORIES,
        values: config.storeCategories,
      });
    }
    if (config.polygon) {
      restrictions.push({
        type: RestrictionTypes.SIMPLE,
        field: 'within',
        value: config.polygon,
        operation: 'eq',
      });
    }
    if (config.searchText && config.searchText !== '') {
      restrictions.push({
        type: RestrictionTypes.SIMPLE,
        field: BranchesRestrictionFields.KEYWORD,
        value: config.searchText,
        operation: 'eq',
      });
    }
    const defaultLocation = this.locationService.defaultLocation;
    const size = config.size ?? 10;
    const page = config.page ?? 0;
    let data: SearchBranchesBodyModel = {
      latitude: this.location()?.latitude ?? defaultLocation.latitude,
      longitude: this.location()?.longitude ?? defaultLocation.longitude,
      size,
      page,
      searchRequest: {
        restrictions,
        orders: [
          {
            field: 'distance',
            order: OrderTypes.ASC,
          },
        ],
      },
    };
    let url = 'app/store/stores/branches/search';
    const body = data.searchRequest;
    if ('website' == this.environment['appName']) {
      url = 'stores/branches/search';
    }
    const request = new RequestBuilder(RequestTypeEnum.POST, url, body);
    Object.prototype.hasOwnProperty.call(data, 'searchRequest') ? delete data.searchRequest : noop();
    if (config.mode) {
      data = { ...data, mode: config.mode };
    }
    request.setParams(data);
    return this.apiService.call<SearchBranchesResponseModel>(request);
  }

  getStoreBranches(
    mode: 'branch-only' | 'store-summary' | undefined = undefined,
    storeTrackingCode: string,
    location: Coordination,
    size = 10,
  ): Observable<BranchSearchApiResponse> {
    let url = `app/store/stores/branches/search?size=${size}&latitude=${location.latitude}&longitude=${location.longitude}`;
    if (mode) {
      url = url + '&project=' + mode;
    }
    const restriction: Restriction<any> = {
      type: RestrictionTypes.SIMPLE,
      field: BranchesRestrictionFields.STORE_TRACKING_CODE,
      value: storeTrackingCode,
      operation: 'eq',
    };
    const request = new RequestBuilder(RequestTypeEnum.POST, url, {
      restrictions: [restriction],
      orders: [
        {
          field: 'distance',
          order: 'asc',
        },
      ],
    });
    return this.apiService.call<BranchSearchApiResponse>(request);
  }

  searchVouchers(
    page = 0,
    size = 10,
    mode: 'voucher-only' | 'store-summary' | undefined = undefined,
    filterExpired = false,
    storeTrackingCode?: string,
    category?: StoreCategory,
    searchText?: string,
  ): Observable<VoucherResponseModel> {
    const restrictions: any[] = [VouchersDefaultRestriction];
    if (searchText && searchText !== '') {
      restrictions.push({
        type: RestrictionTypes.SIMPLE,
        field: VouchersRestrictionFields.KEYWORD,
        value: searchText,
        operation: 'eq',
      });
    }
    // Filter Categories
    if (category) {
      const oldCategoryIndex = restrictions.findIndex((r) => r.field === StoreRestrictionFields.CATEGORIES);
      if (oldCategoryIndex !== -1) {
        restrictions.splice(oldCategoryIndex, 1);
      }
      restrictions.push({
        type: RestrictionTypes.COLLECTION,
        values: [StoreCategoryTitle[category!.title]],
        field: VouchersRestrictionFields.STORE_CATEGORIES,
      });
    }

    // Store Tracking Code Filter
    if (storeTrackingCode) {
      restrictions.push({
        type: RestrictionTypes.SIMPLE,
        value: storeTrackingCode,
        field: VouchersRestrictionFields.STORE_TRACKING_CODE,
        operation: 'eq',
      });
    }

    // Filter Expired Ones
    if (filterExpired) {
      restrictions.push({
        type: RestrictionTypes.SIMPLE,
        value: Date.now(),
        field: VouchersRestrictionFields.EXPIRATION_DATE,
        operation: 'gt',
      });
    }

    let data: SearchVouchersBodyModel = {
      size,
      page,
      searchRequest: {
        restrictions,
        orders: [{
          field: 'priority',
          order: OrderTypes.ASC
        }]
      }
    };
    let url = 'app/store/stores/vouchers/search';
    const body = data.searchRequest;
    if ('website' == this.environment['appName']) {
      url = 'stores/vouchers/search';
    }
    const request = new RequestBuilder(RequestTypeEnum.POST, url, body);
    Object.prototype.hasOwnProperty.call(data, 'searchRequest') ? delete data.searchRequest : noop();
    if (mode) {
      data = { ...data, project: mode };
    }
    request.setParams(data);
    return this.apiService.call<VoucherResponseModel>(request);
  }

  getMerchantUniqueId(storeTrackingCode: string): Observable<{ merchantUniqueId: string }> {
    const request = new RequestBuilder(RequestTypeEnum.GET, `app/store/stores/${storeTrackingCode}/merchant-detail`);
    return this.apiService.call<{ merchantUniqueId: string }>(request);
  }

  submitViolation(violation: ViolationRequestBody): Observable<{ uid: string }> {
    const request = new RequestBuilder(RequestTypeEnum.POST, 'app/store/stores/violation-reports', violation);
    return this.apiService.call<{ uid: string }>(request);
  }

  uploadViolationReportImages(violationReportUid: string, file: File): Observable<ApiResultInterface> {
    const formData = new FormData();
    formData.append('file', file);
    const request = new RequestBuilder(RequestTypeEnum.POST, 'app/store/stores/violation-reports/images', formData as any);
    request.setParams({ violationReportUid });
    return this.apiService.call<ApiResultInterface>(request);
  }
}
