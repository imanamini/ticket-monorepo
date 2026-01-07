import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, shareReplay } from 'rxjs';
import { BaseComponent } from '../../../../../../components/base/base.component';
import {
  MotorApplicationFormApiService
} from '../../../../data-access/services/third-party-motor/motor-application-form-api.service';

import { ConstantAllService } from '../../../../data-access/services/shared/constant-all.service';
import { ApplicationFormMotorModel } from '../models/application-form-motor-response.model';
import { ApplicationFormMotorPutRequestModel } from '../models/application-form-motor-put-request.model';
import { QueryParamService } from '../../../../../../data-access/services/query-param.service';
import { ThirdPartyMotorKeysEnum } from '../enums/third-party-motor-keys.enum';

@Injectable({
  providedIn: 'root'
})
export class MotorStoreService extends BaseComponent {
  private motorApplicationFormApiService = inject(MotorApplicationFormApiService);
  private constantAllService = inject(ConstantAllService);
  private queryParamService = inject(QueryParamService);

  private storeData$ = new BehaviorSubject<ApplicationFormMotorModel | null>(null);
  private formId: string | null = null;

  public get hasDiscount(): boolean {
    const data = this.getStoreData();
    const hasThirdPartyDiscount: boolean = data.previousInsuranceDetail?.thirdPartyDiscountId &&
      data.previousInsuranceDetail?.thirdPartyDiscountId !== this.constantAllService.thirdPartyDiscountDefaultValue();
    const hasDriverDiscount: boolean = data.previousInsuranceDetail?.driverDiscountId &&
      data.previousInsuranceDetail?.driverDiscountId !== this.constantAllService.driverDiscountDefaultValue();
    return (hasDriverDiscount || hasThirdPartyDiscount);
  }

  setStoreData(data: ApplicationFormMotorModel): void {
    this.storeData$.next(data);
    this.formId = data.applicationFormId;
  }

  getStoreData(): ApplicationFormMotorModel | null {
    return this.storeData$.value;
  }

  getStoreDataAsObservable(): Observable<ApplicationFormMotorModel | null> {
    return this.storeData$.asObservable();
  }

  getFormId(): string | null {
    return this.formId;
  }

  setFormId(formId: string): void {
    this.formId = formId;
  }

  public getStoreValueAsPutRequest(): ApplicationFormMotorPutRequestModel {
    const data = this.getStoreData();
    if (!data) {
      return null;
    }

    return {
      applicationFormId: data.applicationFormId,
      vehicleInfo: {
        vehicleOwnerChanged: data?.vehicleInfo?.vehicleOwnerChanged,
        buildYear: data?.vehicleInfo?.buildYear,
        typeId: data?.vehicleInfo?.typeId,
        releaseDate: data?.vehicleInfo?.releaseDate,
      },
      previousInsuranceDetail: {
        insuranceCompany: {
          insuranceCompanyId: 0
        },
        insurerParty: {
          insurerPartyId: data?.previousInsuranceDetail?.insurerParty?.insurerPartyId
        },
        thirdPartyDiscountId: data?.previousInsuranceDetail?.thirdPartyDiscountId,
        driverDiscountId: data?.previousInsuranceDetail?.driverDiscountId,
        propertyDamageId: data?.previousInsuranceDetail?.propertyDamageId,
        healthDamageId: data?.previousInsuranceDetail?.healthDamageId,
        driverDamageId: data?.previousInsuranceDetail?.driverDamageId,
        startsAt: data?.previousInsuranceDetail?.startsAt,
        endsAt: data?.previousInsuranceDetail?.endsAt,
      },
      license: data?.license,
    };
  }

  loadUnauthorizedApplicationData(): void {
    if (this.storeData$.getValue()) {
      return;
    }

    super.addSubscription(this.motorApplicationFormApiService.getRequestData(this.formId)
      .pipe(shareReplay(1))
      .subscribe({
        next: res => {
          this.setStoreData(res.result);
        }
      }));
  }

  loadAuthorizedApplicationData(): void {
    super.addSubscription(this.queryParamService.getQueryParams([ThirdPartyMotorKeysEnum.FormId], false).subscribe({
      next: param => {
        const formId = param[ThirdPartyMotorKeysEnum.FormId];
        if (!formId) {
          return;
        }
        super.addSubscription(this.motorApplicationFormApiService.getApplicationForm(formId).subscribe({
          next: response => {
            this.setStoreData(response.result);
          }
        }));
      }
    }));
  }

  clearStore(): void {
    this.storeData$.next(null);
    this.formId = null;
  }
}
