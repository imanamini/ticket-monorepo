import { Component, inject, OnInit, signal } from '@angular/core';
import { QueryParamService } from '../../../../../../data-access/services/query-param.service';
import { BaseComponent } from '../../../../../../components/base/base.component';
import {
  MotorApplicationFormApiService
} from '../../../../data-access/services/third-party-motor/motor-application-form-api.service';
import { ThirdPartyKeysEnum } from '../../../third-party/data-access/enums/third-party-keys.enum';
import { QueryParamKeysEnum } from '../../../../../home/query-param-keys.enum';
import { VEHICLE_ORDER_STATE_ENUM } from '../../../../../../data-access/enums/vehicle-order-state.enum';
import { THIRD_PARTY_MOTOR_ROUTE } from '../../data-access/constants/third-party-motor-route.const';
import { Router } from '@angular/router';
import { InsuranceUrlsEnum } from '../../../../../../data-access/enums/insurance-urls.enum';
import { InsuranceKeysEnum } from '../../../../../../data-access/enums/insurance-keys.enum';
import { InsuranceTabEnum } from '../../../../../policy/data-access/enums/policy-list.enum';
import { INSURANCE_APP_PREFIX } from '../../../../../../data-access/constants/insurance-app-prefix.constant';
import { PRODUCT_TYPE_BASE_URL } from '../../../../../../data-access/constants/product-type-base-url.constant';
import { InsuranceProductTypeEnum } from '../../../../../../data-access/enums/Insurance-product-type.enum';

@Component({
  selector: 'order-state',
  standalone: true,
  imports: [],
  template: `
    @if (isLoading()) {
      <div
              style="position: fixed; inset: 0; background: white; width: 100%; height: 100%; z-index: 999; display: flex; justify-content: center; align-items: center"
      ></div>
    }
  `,
  styles: ``,
})
export class MotorOrderStateComponent extends BaseComponent implements OnInit {
  private readonly applicationFormApiService = inject(MotorApplicationFormApiService);
  private readonly queryParamService = inject(QueryParamService);
  private readonly router = inject(Router);

  public isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.handleStates();
  }

  handleStates(): void {
    super.addSubscription(
      this.queryParamService.getQueryParams([ThirdPartyKeysEnum.FormId, QueryParamKeysEnum.Referrer], false).subscribe((params) => {
        if (params[ThirdPartyKeysEnum.FormId]) {
          super.addSubscription(
            this.applicationFormApiService.getOrderState(params[ThirdPartyKeysEnum.FormId]).subscribe({
              next: (orderStateResult) => {
                let route: string;
                if (orderStateResult.success && orderStateResult.result?.currentState) {
                  switch (orderStateResult.result.currentState) {
                    case VEHICLE_ORDER_STATE_ENUM.DRAFT:
                    case VEHICLE_ORDER_STATE_ENUM.CHECKOUT:
                    case VEHICLE_ORDER_STATE_ENUM.PENDING_PAYMENT:
                      route = InsuranceUrlsEnum.VehicleThirdPartyMotor + '/' + THIRD_PARTY_MOTOR_ROUTE.Checkout;
                      break;
                    case VEHICLE_ORDER_STATE_ENUM.PAID:
                      route = InsuranceUrlsEnum.VehicleThirdPartyMotor + '/' + THIRD_PARTY_MOTOR_ROUTE.UserInfo;
                      params[ThirdPartyKeysEnum.NoCheck] = '1';
                      break;
                    case VEHICLE_ORDER_STATE_ENUM.USER_INFO_COMPLETED:
                      route = InsuranceUrlsEnum.VehicleThirdPartyMotor + '/' + THIRD_PARTY_MOTOR_ROUTE.UploadDocument;
                      params[ThirdPartyKeysEnum.NoCheck] = '1';
                      break;
                    case VEHICLE_ORDER_STATE_ENUM.DOCUMENTS_UPLOADED:
                      route = InsuranceUrlsEnum.VehicleThirdPartyMotor + '/' + THIRD_PARTY_MOTOR_ROUTE.UserAddress;
                      params[ThirdPartyKeysEnum.NoCheck] = '1';
                      break;
                    case VEHICLE_ORDER_STATE_ENUM.DOCUMENTS_CONFLICT:
                      route = InsuranceUrlsEnum.VehicleThirdPartyMotor + '/' + THIRD_PARTY_MOTOR_ROUTE.ResolveDocumentsConflict;
                      break;
                    case VEHICLE_ORDER_STATE_ENUM.WAITING_FOR_POSTAL_CODE:
                      route = InsuranceUrlsEnum.VehicleThirdPartyMotor + '/' + THIRD_PARTY_MOTOR_ROUTE.VerifyPostalCode;
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
                      route = InsuranceUrlsEnum.PolicyDetail;
                      params[InsuranceKeysEnum.POLICY_TYPE] = InsuranceTabEnum.THIRD_PARTY_MOTOR;
                      break;
                    default:
                      route = InsuranceUrlsEnum.VehicleThirdPartyMotor + '/' + THIRD_PARTY_MOTOR_ROUTE.ExInsurerMotor;
                      break;
                  }
                  if (route) {
                    this.router
                      .navigate([`/${INSURANCE_APP_PREFIX}/${route}`], {
                        queryParamsHandling: null,
                        replaceUrl: true,
                        queryParams: params,
                      })
                      .then(() => {
                        this.isLoading.set(false);
                      });
                  } else {
                    this.router
                      .navigate(
                        [`/${PRODUCT_TYPE_BASE_URL[InsuranceProductTypeEnum.ThirdPartyMotor]}${THIRD_PARTY_MOTOR_ROUTE.ExInsurerMotor}`],
                        {
                          queryParamsHandling: null,
                          replaceUrl: true,
                          queryParams: {
                            [ThirdPartyKeysEnum.FormId]: params[ThirdPartyKeysEnum.FormId],
                            [ThirdPartyKeysEnum.Referrer]: params[ThirdPartyKeysEnum.Referrer],
                          },
                        },
                      )
                      .then(() => {
                        this.isLoading.set(false);
                      });
                  }
                }
              },
              error: () => this.isLoading.set(false),
              complete: () => this.isLoading.set(false),
            })
          );
        } else {
          this.isLoading.set(false);
        }
      }),
    );
  }
}
