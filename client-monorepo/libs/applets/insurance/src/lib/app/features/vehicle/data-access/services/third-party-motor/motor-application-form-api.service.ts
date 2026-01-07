import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { BaseApiService } from '../shared/base-api.service';
import { ApplicationFormPostRequestModel } from '../../models/application-form/application-form-post-request.model';
import { UatGeneralResponse } from '../../models/uat-general.response';
import {
  AvailableProductsPostRequestModel
} from '../../models/third-party/available-products/available-products-post-request.model';
import {
  AvailableProductsPostResponseModel
} from '../../models/third-party/available-products/available-products-post-response.model';
import { PurchaseTicketTypeEnum } from '../../enums/purchase-ticket-type.enum';
import { PaymentRequestResultModel } from '../../models/third-party/order/payment-request-result.model';
import {
  ApplicationFormMotorPutRequestModel
} from '../../../features/third-party-motor/data-access/models/application-form-motor-put-request.model';
import {
  ApplicationFormMotorModel
} from '../../../features/third-party-motor/data-access/models/application-form-motor-response.model';
import { UploadedDocumentModel } from '../../models/third-party/upload-document/uploaded-document.model';
import { VerifiedAllocationRequestModel } from '../../models/application-form/verified-allocations-request.model';
import { VerifiedAllocationsResponseModel } from '../../models/application-form/verified-allocations-response.model';
import { HttpHeaders } from '@angular/common/http';
import { ERROR_HANDLE_KEY, ErrorHandleHeaderEnum } from '../../../../../data-access/enums/error-handle-header.enum';
import { VoucherResponseModel } from '../../models/third-party/voucher/voucher-response.model';
import { PaymentRequestTypeEnum } from '../../enums/payment-request-type.enum';
import { VehiclePaymentResultModel } from '../../models/third-party/payment/vehicle-payment-result.model';
import { VEHICLE_ORDER_STATE_ENUM } from '../../../../../data-access/enums/vehicle-order-state.enum';
import {
  CompleteOrderModel
} from '../../../features/third-party/features/order/features/complete-order/complete-order.model';
import { InsuredPartyModel } from '../../models/application-form/insured-party.model';
import { catchError } from 'rxjs/operators';
import { VehicleErrorCode } from '../../enums/vehicle-error-code.enum';
import {
  THIRD_PARTY_MOTOR_ROUTE
} from '../../../features/third-party-motor/data-access/constants/third-party-motor-route.const';
import { Router } from '@angular/router';
import {
  THIRD_PARTY_MOTOR_ROUTES
} from '../../../features/third-party-motor/data-access/constants/third-party-motor-routes.const';
import { UserAddressModel } from '../../models/application-form/user-address.model';

@Injectable({
  providedIn: 'root'
})
export class MotorApplicationFormApiService extends BaseApiService {
  private applicationUrl = this.baseUrl + 'motor/application-forms';
  private readonly router = inject(Router);

  postApplicationForm(model: ApplicationFormPostRequestModel): Observable<UatGeneralResponse<{
    id: string
  }>> {
    return super.post(this.applicationUrl, model);
  }

  putApplicationForm(model: ApplicationFormMotorPutRequestModel): Observable<UatGeneralResponse<ApplicationFormMotorModel>> {
    return super.put(this.applicationUrl, model);
  }

  getApplicationForm(id: string): Observable<UatGeneralResponse<ApplicationFormMotorModel>> {
    return super.get(`${this.applicationUrl}/${id}`);
  }

  getRequestData(id: string): Observable<UatGeneralResponse<ApplicationFormMotorModel>> {
    return super.get(this.applicationUrl + '/' + id + '/request-data');
  }

  postAvailableProducts(data: AvailableProductsPostRequestModel,
                        id: string): Observable<UatGeneralResponse<AvailableProductsPostResponseModel>> {
    return super.post(this.applicationUrl + '/' + id + '/available-products', data);
  }

  updateInsuredParty(data: InsuredPartyModel,
                     id: string): Observable<UatGeneralResponse<boolean>> {
    return super.put(this.applicationUrl + '/' + id + '/insured-parties', data).pipe(
      catchError((err) => {
          if (err?.error?.error?.code === VehicleErrorCode.InappropriateAction) {
            this.router.navigate(['vehicle', THIRD_PARTY_MOTOR_ROUTES.ThirdPartyMotor, THIRD_PARTY_MOTOR_ROUTE.OrderState], {
              queryParamsHandling: 'merge'
            });
          }
          return throwError(() => err);
        }
      ));
  }

  createApplicationFormDraft(id: string, insurerPartyId: string): Observable<UatGeneralResponse<boolean>> {
    return super.put(`${this.applicationUrl}/${id}/draft`, {insurerPartyId});
  }

  paymentRequest(applicationFormId: string,
                 paymentRequestType: PaymentRequestTypeEnum,
                 isHybrid: boolean,
                 referrer: string | null,
                 ticketType?: PurchaseTicketTypeEnum)
    : Observable<UatGeneralResponse<PaymentRequestResultModel>> {
    return super.post(`${this.applicationUrl}/${applicationFormId}/payments/request`, {
      isHybrid,
      origin: window.location.host,
      referrer,
      ticketType,
      paymentRequestType
    });
  }

  getRequiredFiles(id: string): Observable<UatGeneralResponse<UploadedDocumentModel[]>> {
    return super.get(this.applicationUrl + `/${id}/required-files`);
  }

  checkOrderDocumentsBeingUploaded(applicationFormId: string, documentConflict: boolean): Observable<UatGeneralResponse<boolean>> {
    return super.get(`${this.applicationUrl}/${applicationFormId}/documents/check?documentConflict=${documentConflict}`);
  }

  putVerifyAllocation(id: string, userDetail: VerifiedAllocationRequestModel):
    Observable<UatGeneralResponse<VerifiedAllocationsResponseModel>> {
    const headers: HttpHeaders = new HttpHeaders({[ERROR_HANDLE_KEY]: ErrorHandleHeaderEnum.NO_HANDLE});
    return super.put(`${this.applicationUrl}/${id}/verified-allocations`, userDetail, headers);
  }

  addVoucher(applicationFormId: string,
             discountCode: string,
             ticketType: PurchaseTicketTypeEnum): Observable<UatGeneralResponse<VoucherResponseModel>> {
    const headers: HttpHeaders = new HttpHeaders({[ERROR_HANDLE_KEY]: ErrorHandleHeaderEnum.NO_HANDLE});
    return super.put(
      `${this.applicationUrl}/${applicationFormId}/reserve-discount?DiscountCode=${discountCode}&TicketType=${ticketType}`, {}, headers);
  }

  removeVoucher(applicationFormId: string): Observable<UatGeneralResponse<VoucherResponseModel>> {
    return super.put(`${this.applicationUrl}/${applicationFormId}/reverse-discount`);
  }

  getPaymentResult(providerId: string): Observable<UatGeneralResponse<VehiclePaymentResultModel>> {
    return super.get(`${this.applicationUrl}/payments/${providerId}/result`);
  }

  postCompleteLater(applicationFormId: string): Observable<UatGeneralResponse<boolean>> {
    return super.put(`${this.applicationUrl}/${applicationFormId}/complete-later`);
  }

  getOrderState(id: string): Observable<UatGeneralResponse<{ currentState: VEHICLE_ORDER_STATE_ENUM }>> {
    return super.get(`${this.applicationUrl}/${id}/state`);
  }

  getCompleteLater(applicationFormId: string): Observable<UatGeneralResponse<CompleteOrderModel>> {
    return super.get(`${this.applicationUrl}/${applicationFormId}/complete-later`);
  }

  checkCompleteJourney(applicationFormId: string): Observable<UatGeneralResponse<CompleteOrderModel>> {
    return super.get(`${this.applicationUrl}/${applicationFormId}/check-complete-journey`);
  }

  checkHybrid(providerId: string): Observable<UatGeneralResponse<string>> {
    return super.get(`${this.applicationUrl}/payments/${providerId}/check-hybrid`);
  }

  putVerifyPostalCode(id: string, address: UserAddressModel): Observable<UatGeneralResponse<boolean>> {
    const headers: HttpHeaders = new HttpHeaders({[ERROR_HANDLE_KEY]: ErrorHandleHeaderEnum.NO_HANDLE});
    return super.put(`${this.applicationUrl}/${id}/verify-postal-code`, address, headers);
  }
}
