import { inject, Injectable } from '@angular/core';
import { DigikalaJetApiResponse, DigikalaJetProduct } from '../models/digikala-jet.model';
import { Observable } from 'rxjs';
import { ProductInterface, StorePaymentMethod } from '@client-monorepo/stores';
import { ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';

@Injectable()
export class DigikalaJetService {
  private apiUrl = 'fresh/v1/?_whid=148&utm_source=digipay&utm_medium=home-category';
  apiService = inject(ApiService);

  getProducts(): Observable<DigikalaJetApiResponse> {
    return this.apiService.call<DigikalaJetApiResponse>(new RequestBuilder(RequestTypeEnum.GET, this.apiUrl));
  }

  mapDigikalaJetProductsToOurProducts(digikalaJetProducts: DigikalaJetProduct[]): ProductInterface[] {
    const products: ProductInterface[] = [];
    for (const digikalaJetProduct of digikalaJetProducts) {
      products.push({
        title: digikalaJetProduct.title_fa,
        url: '',
        documentId: '',
        hostName: '',
        price: (digikalaJetProduct.default_variant.price.selling_price / 10).toString(),
        previousPrice: (digikalaJetProduct.default_variant.price.rrp_price / 10).toString(),
        discount: (digikalaJetProduct.default_variant.price.rrp_price - digikalaJetProduct.default_variant.price.selling_price) / 10,
        mainCategory: digikalaJetProduct.data_layer.item_category2,
        categories: undefined,
        image: digikalaJetProduct.images.main.webp_url[0],
        storeLogoImageId: undefined,
        storeName: undefined,
        storePaymentMethods: [StorePaymentMethod.BNPL, StorePaymentMethod.C_CREDIT],
      });
    }
    return products;
  }
}
