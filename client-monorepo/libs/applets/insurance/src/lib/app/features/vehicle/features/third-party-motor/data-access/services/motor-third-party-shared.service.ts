import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PRODUCT_TYPE_BASE_URL } from '../../../../../../data-access/constants/product-type-base-url.constant';
import { InsuranceProductTypeEnum } from '../../../../../../data-access/enums/Insurance-product-type.enum';

@Injectable({
  providedIn: 'root'
})
export class MotorThirdPartySharedService {

  private router = inject(Router);
  public readonly baseUrl = PRODUCT_TYPE_BASE_URL[InsuranceProductTypeEnum.ThirdPartyMotor];

  navigate(route: string, option: {
    baseUrl?: boolean,
    replace?: boolean,
    queryParamsHandling?: 'preserve' | 'merge' | null,
    queryParams?: { [key: string]: string },
    callback?: () => void,
    fragment?: string
  } = {}): void {
    option = Object.assign({
      baseUrl: true,
      replace: false,
      queryParamsHandling: 'preserve',
      queryParams: {}
    }, option);
    this.router.navigate([option.baseUrl ? this.baseUrl + route : route], {
      queryParamsHandling: option.queryParamsHandling,
      replaceUrl: option.replace,
      queryParams: option.queryParams,
      fragment: option.fragment
    }).then(() => {
      if (option.callback) {
        option.callback();
      }
    });
  }
}
