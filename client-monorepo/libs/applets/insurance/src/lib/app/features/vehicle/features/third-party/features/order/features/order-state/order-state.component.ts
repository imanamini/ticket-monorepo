import { Component, inject, OnInit } from '@angular/core';
import { VEHICLE_ORDER_STATE_ENUM } from '../../../../../../../../data-access/enums/vehicle-order-state.enum';
import { QueryParamService } from '../../../../../../../../data-access/services/query-param.service';
import { BaseComponent } from '../../../../../../../../components/base/base.component';
import { InsuranceUrlsEnum } from '../../../../../../../../data-access/enums/insurance-urls.enum';
import { InsuranceKeysEnum } from '../../../../../../../../data-access/enums/insurance-keys.enum';
import { QueryParamKeysEnum } from '../../../../../../../home/query-param-keys.enum';
import { VehicleSharedService } from '../../../../../../data-access/services/vehicle-shared.service';
import { ThirdPartyKeysEnum } from '../../../../data-access/enums/third-party-keys.enum';
import { ThirdPartyUrlsEnum } from '../../../../data-access/enums/third-party-urls.enum';
import {
  ApplicationFormApiService
} from '../../../../../../data-access/services/third-party/application-form-api.service';
import { InsuranceTabEnum } from '../../../../../../../policy/data-access/enums/policy-list.enum';
import { InsuranceProductTypeEnum } from '../../../../../../../../data-access/enums/Insurance-product-type.enum';
import { PRODUCT_TYPE_BASE_URL } from '../../../../../../../../data-access/constants/product-type-base-url.constant';
import { INSURANCE_APP_PREFIX } from '../../../../../../../../data-access/constants/insurance-app-prefix.constant';

@Component({
  selector: 'order-state',
  standalone: true,
  imports: [],
  template: `
    @if (isLoading) {
      <div
              style="position: fixed; inset: 0; background: white; width: 100%; height: 100%; z-index: 999; display: flex; justify-content: center; align-items: center">
      </div>
    }
  `,
  styles: ``
})
export class OrderStateComponent extends BaseComponent implements OnInit {

  constructor() {
    super();
  }

  private applicationFormApiService = inject(ApplicationFormApiService);
  private queryParamService = inject(QueryParamService);
  private sharedService = inject(VehicleSharedService);

  public isLoading = true;

  ngOnInit(): void {
    this.handleStates();
  }

  handleStates(): void {
    super.addSubscription(this.queryParamService.getQueryParams(
      [ThirdPartyKeysEnum.FormId, QueryParamKeysEnum.JourneyType], false).subscribe(params => {
      if (params[ThirdPartyKeysEnum.FormId]) {
        super.addSubscription(
          this.applicationFormApiService.getOrderState(params[ThirdPartyKeysEnum.FormId]).subscribe(
            {
              next: orderStateResult => {
                let route: string;
                if (orderStateResult.success && orderStateResult.result?.currentState) {
                  switch (orderStateResult.result.currentState) {
                    case VEHICLE_ORDER_STATE_ENUM.DRAFT:
                    case VEHICLE_ORDER_STATE_ENUM.CHECKOUT:
                    case VEHICLE_ORDER_STATE_ENUM.PENDING_PAYMENT:
                      route = PRODUCT_TYPE_BASE_URL[InsuranceProductTypeEnum.ThirdParty] + ThirdPartyUrlsEnum.OrderCheckout;
                      break;
                    case VEHICLE_ORDER_STATE_ENUM.PAID:
                      route = PRODUCT_TYPE_BASE_URL[InsuranceProductTypeEnum.ThirdParty] + ThirdPartyUrlsEnum.UserInfo;
                      params[ThirdPartyKeysEnum.NoCheck] = '1';
                      break;
                    case VEHICLE_ORDER_STATE_ENUM.USER_INFO_COMPLETED:
                      route = PRODUCT_TYPE_BASE_URL[InsuranceProductTypeEnum.ThirdParty] + ThirdPartyUrlsEnum.UploadDocument;
                      params[ThirdPartyKeysEnum.NoCheck] = '1';
                      break;
                    case VEHICLE_ORDER_STATE_ENUM.DOCUMENTS_UPLOADED:
                      route = PRODUCT_TYPE_BASE_URL[InsuranceProductTypeEnum.ThirdParty] + ThirdPartyUrlsEnum.Address;
                      params[ThirdPartyKeysEnum.NoCheck] = '1';
                      break;
                    case VEHICLE_ORDER_STATE_ENUM.DOCUMENTS_CONFLICT:
                      route = PRODUCT_TYPE_BASE_URL[InsuranceProductTypeEnum.ThirdParty] + ThirdPartyUrlsEnum.ResolveDocumentsConflict;
                      break;
                    case VEHICLE_ORDER_STATE_ENUM.WAITING_FOR_POSTAL_CODE:
                      route = PRODUCT_TYPE_BASE_URL[InsuranceProductTypeEnum.ThirdParty] + ThirdPartyUrlsEnum.OrderVerifyPostalCode;
                      break;
                    case VEHICLE_ORDER_STATE_ENUM.REFUSED:
                    case VEHICLE_ORDER_STATE_ENUM.PROVISIONING:
                    case VEHICLE_ORDER_STATE_ENUM.PENDING_REVIEW:
                    case VEHICLE_ORDER_STATE_ENUM.REVIEWED:
                    case VEHICLE_ORDER_STATE_ENUM.PRICE_CONFLICT:
                    case VEHICLE_ORDER_STATE_ENUM.PENDING_ISSUANCE:
                    case VEHICLE_ORDER_STATE_ENUM.VERIFY_POSTAL_CODE:
                    case VEHICLE_ORDER_STATE_ENUM.ISSUED:
                    case VEHICLE_ORDER_STATE_ENUM.CANCELLED:
                    case VEHICLE_ORDER_STATE_ENUM.EXPIRED:
                    case VEHICLE_ORDER_STATE_ENUM.ADDRESS_INSERTED:
                    case VEHICLE_ORDER_STATE_ENUM.DELIVERY_METHOD_INSERTED:
                      route = INSURANCE_APP_PREFIX + '/' + InsuranceUrlsEnum.PolicyDetail;
                      params[InsuranceKeysEnum.POLICY_TYPE] = InsuranceTabEnum.THIRD_PARTY;
                      break;
                    default:
                      route = INSURANCE_APP_PREFIX + '/' + ThirdPartyUrlsEnum.ThirdParty;
                      break;
                  }
                  if (route) {
                    this.sharedService.navigate(route, {
                      queryParams: params,
                      baseUrl: false,
                      replace: true,
                      queryParamsHandling: null,
                      callback: () => {
                        this.isLoading = false;
                      }
                    }, InsuranceProductTypeEnum.ThirdParty);
                  } else {
                    this.sharedService.navigate('', {
                      baseUrl: true,
                      queryParamsHandling: null, callback: () => {
                        this.isLoading = false;
                      }
                    }, InsuranceProductTypeEnum.ThirdParty);
                  }
                }
              },
              error: () => this.isLoading = false,
              complete: () => this.isLoading = false
            }));
      } else {
        this.isLoading = false;
      }
    }));
  }
}
