import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { ProductListPayloadInterface } from '../models/product-list-payload.interface';
import { ProductListResponseInterface } from '../models/product-list-response.interface';
import { HttpParams } from '@angular/common/http';
import { SearchSuggestionApiResponseInterface } from '../models/search-suggestion-api-response.interface';
import { CleanerPipe, StripTagsPipe } from '@digipay/ng-lib-pipes';
import { ProductsSortAndFilterService } from './products-sort-and-filter.service';

@Injectable({
  providedIn: 'root',
})
export class ProductApiService {
  apiService = inject(ApiService);
  sortAndFilterService = inject(ProductsSortAndFilterService);
  searchEndpoint = 'app/store/search';

  getAllProducts(payload: ProductListPayloadInterface): Observable<ProductListResponseInterface> {
    const { restrictions, orders, ...queryParams } = payload;
    const body = {
      restrictions,
      orders,
    };
    const params = new HttpParams({
      fromObject: queryParams as { [key: string]: any },
    }).toString();
    const request = new RequestBuilder(RequestTypeEnum.POST, `${this.searchEndpoint}?${params}`, body);
    return this.apiService.call<ProductListResponseInterface>(request).pipe(
      map((response) => {
        this.setPriceFacet(response);
        response.products = response.products.map((product) => {
          product.url = new CleanerPipe().transform(new StripTagsPipe().transform(product.url));
          return product;
        });
        return response;
      }),
    );
  }

  clickOnProduct(documentId: string, queryId: string, position: string | number): Observable<void> {
    const params = {
      documentId,
      queryId,
      position,
    };
    const request = new RequestBuilder(RequestTypeEnum.POST, this.searchEndpoint + '/click', params);
    return this.apiService.call<void>(request);
  }

  getSearchSuggestions(keyword: string): Observable<SearchSuggestionApiResponseInterface> {
    const request = new RequestBuilder(RequestTypeEnum.GET, `${this.searchEndpoint}/suggest?keyword=${keyword}`);
    return this.apiService.call<SearchSuggestionApiResponseInterface>(request);
  }

  setPriceFacet(response: ProductListResponseInterface): void {
    if (response.facets && response.facets.length) {
      const priceFacet = response.facets.find((fct) => fct.facetName === 'price');
      if (priceFacet && priceFacet.min !== undefined && priceFacet.max !== undefined) {
        this.sortAndFilterService.setPriceFacet(priceFacet.min, priceFacet.max);
      }
    }
  }
}
