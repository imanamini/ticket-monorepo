import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { InsuranceProductTypeEnum } from '../../../../data-access/enums/Insurance-product-type.enum';
import { PRODUCT_TYPE_BASE_URL } from '../../../../data-access/constants/product-type-base-url.constant';

@Injectable({
  providedIn: 'root'
})
export class VehicleSharedService {

  private router = inject(Router);

  navigate(
    route: string,
    option: {
      baseUrl?: boolean,
      replace?: boolean,
      queryParamsHandling?: 'preserve' | 'merge' | null,
      queryParams?: { [key: string]: string },
      callback?: () => void,
      fragment?: string
    } = {},
    productType: InsuranceProductTypeEnum
  ): Promise<boolean> {
    option = Object.assign({
      baseUrl: true,
      replace: false,
      queryParamsHandling: 'preserve',
      queryParams: {}
    }, option);
    return new Promise(resolve => {
      this.router.navigate([option.baseUrl ? PRODUCT_TYPE_BASE_URL[productType] + route : route], {
        queryParamsHandling: option.queryParamsHandling,
        replaceUrl: option.replace,
        queryParams: option.queryParams,
        fragment: option.fragment
      }).then(() => {
        if (option.callback) {
          option.callback();
        }
        resolve(true);
      });
    })
  }
}
