import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  ApplicationFormGetResponseModel
} from '../../../../data-access/models/application-form/application-form-get-response.model';
import { BaseComponent } from '../../../../../../components/base/base.component';
import { StoreModel } from '../models/store.model';
import {
  ApplicationFormPutRequestModel
} from '../../../../data-access/models/application-form/application-form-put-request.model';
import { ApplicationFormApiService } from '../../../../data-access/services/third-party/application-form-api.service';
import { QueryParamService } from '../../../../../../data-access/services/query-param.service';
import { ThirdPartyKeysEnum } from '../enums/third-party-keys.enum';
import { ExtraInsurerForm } from '../../../../data-access/enums/extra-insurance-company-items.enum';
import { ConstantAllService } from '../../../../data-access/services/shared/constant-all.service';
import moment from 'jalali-moment';

@Injectable({
  providedIn: 'root'
})

export class StoreService extends BaseComponent {
  constructor() {
    super();
  }

  private appFormApi = inject(ApplicationFormApiService);
  private queryParamService = inject(QueryParamService);
  private constantAllService = inject(ConstantAllService);

  private formId = signal<string>(null);
  public discount = signal<number>(null);
  public claim = signal<number>(null);
  public appDataAsAppGetModel = signal<ApplicationFormGetResponseModel>(null);
  private storeData = new BehaviorSubject<StoreModel>(null);

  setStoreData(data?: ApplicationFormGetResponseModel): void {
    this.appDataAsAppGetModel.set(data);

    if (!data) {
      this.storeData.next(null);
      this.discount.set(null);
      this.claim.set(null);
      this.setFormId(null);
      return;
    }
    const carInfo = data?.vehicleInfo;
    const previousInsurance = data.previousInsuranceDetail;

    this.setFormId(data.applicationFormId);

    const hasThirdPartyDiscount: boolean = previousInsurance?.thirdPartyDiscountId &&
      previousInsurance?.thirdPartyDiscountId !== this.constantAllService.thirdPartyDiscountDefaultValue();
    const hasDriverDiscount: boolean = previousInsurance?.driverDiscountId &&
      previousInsurance?.driverDiscountId !== this.constantAllService.driverDiscountDefaultValue();
    this.discount.set(hasDriverDiscount || hasThirdPartyDiscount ? 1 : 0);

    const hasHealthDamage: boolean = previousInsurance?.healthDamageId &&
      previousInsurance?.healthDamageId !== this.constantAllService.healthDamageDefaultValue();
    const hasDriverDamage: boolean = previousInsurance?.driverDamageId &&
      previousInsurance?.driverDamageId !== this.constantAllService.driverDamageDefaultValue();
    const hasPropertyDamage: boolean = previousInsurance?.propertyDamageId &&
      previousInsurance?.propertyDamageId !== this.constantAllService.propertyDamageDefaultValue();
    this.claim.set(hasHealthDamage || hasDriverDamage || hasPropertyDamage ? 1 : 0);

    this.storeData.next({
      vehicleInfo: {
        carType: {
          id: carInfo?.carTypeId,
          title: carInfo?.carType
        },
        carUsage: {
          id: carInfo?.carUsageId,
          title: carInfo?.carUsage
        },
        carBrand: {
          id: carInfo?.carBrandId,
          title: carInfo?.carBrand,
          logo: carInfo?.carBrandLogo
        },
        carModel: {
          id: carInfo?.carModelId,
          title: carInfo?.carModel
        },
        buildYear: carInfo?.carBuildYear,
        ownershipChanged: carInfo?.vehicleOwnerChanged,
        releaseDate: carInfo?.releaseDate ?? null,
      },
      previousInsurance: {
        company: {
          id: carInfo?.releaseDate ? ExtraInsurerForm.NewCar : previousInsurance?.insurerParty?.insurerPartyId,
          title: previousInsurance?.insurerParty?.insurerPartyName,
          logo: previousInsurance?.insurerParty?.insurerPartyLogo
        },
        startsAt: previousInsurance?.startsAt,
        endsAt: previousInsurance?.endsAt,
        thirdPartyDiscount: {
          id: previousInsurance?.thirdPartyDiscountId,
          title: previousInsurance?.thirdPartyDiscount
        },
        driverDiscount: {
          id: previousInsurance?.driverDiscountId,
          title: previousInsurance?.driverDiscount
        },
        driverDamage: {
          id: previousInsurance?.driverDamageId,
          title: previousInsurance?.driverDamage
        },
        healthDamage: {
          id: previousInsurance?.healthDamageId,
          title: previousInsurance?.healthDamage
        },
        propertyDamage: {
          id: previousInsurance?.propertyDamageId,
          title: previousInsurance?.propertyDamage
        },
        insuranceNumber: previousInsurance?.insuranceNumber
      },
      journeyType: data?.journeyType,
      insuredParty: data?.insuredParty,
      requesterParty: data?.requesterParty,
      license: data?.license,
      address: data?.address,
      documents: data?.documents,
      requiredDocuments: data?.requiredDocuments,
      duration: {id: data?.durationId, title: ''},
      coverageRate: {id: data?.coverageRateId, title: ''}
    });
  }

  getStoreDataAsObservable(): Observable<StoreModel> {
    return this.storeData.asObservable();
  }

  getStoreValue(): StoreModel {
    return this.storeData.getValue();
  }

  setFormId(formId?: string): void {
    this.formId.set(formId);
  }

  getFormId(): string {
    return this.formId();
  }

  getStoreValueAsPutRequest(): ApplicationFormPutRequestModel {
    const value = this.getStoreValue();
    return {
      applicationFormId: this.formId(),
      vehicleInfo: {
        carUsageId: value?.vehicleInfo?.carUsage?.id,
        carModelId: value?.vehicleInfo?.carModel?.id,
        carBuildYear: value?.vehicleInfo?.buildYear,
        vehicleOwnerChanged: value?.vehicleInfo?.ownershipChanged,
        releaseDate: value?.vehicleInfo?.releaseDate,
      },
      previousInsuranceDetail: {
        insurerParty: {
          insurerPartyId: value?.previousInsurance?.company?.id
        },
        thirdPartyDiscountId: value?.previousInsurance?.thirdPartyDiscount?.id,
        driverDiscountId: value?.previousInsurance?.driverDiscount?.id,
        driverDamageId: value?.previousInsurance?.driverDamage?.id,
        healthDamageId: value?.previousInsurance?.healthDamage?.id,
        propertyDamageId: value?.previousInsurance?.propertyDamage?.id,
        endsAt: value?.previousInsurance?.endsAt,
        startsAt: value?.previousInsurance?.startsAt,
      },
      durationId: value?.duration?.id,
      coverageRateId: value?.coverageRate?.id,
    };
  }

  loadUnauthorizedApplicationData(): void {
    if (this.storeData.getValue()) {
      return;
    }

    super.addSubscription(this.queryParamService.getQueryParams([ThirdPartyKeysEnum.FormId], false).subscribe({
      next: param => {
        const formId = param[ThirdPartyKeysEnum.FormId];
        if (!formId) {
          return;
        }
        super.addSubscription(this.appFormApi.getRequestData(formId).subscribe({
          next: res => {
            this.setStoreData(res.result);
          }
        }));
      }
    }));
  }

  loadUnauthorizedApplicationDataObservable(): Observable<StoreModel> {
    if (this.getStoreValue()) {
      return new Observable<StoreModel>(observer => {
        observer.next(this.getStoreValue());
        observer.complete();
      });
    }

    return new Observable<StoreModel>(observer => {
      this.queryParamService.getQueryParams([ThirdPartyKeysEnum.FormId], false).subscribe({
        next: param => {
          const formId = param[ThirdPartyKeysEnum.FormId];
          if (!formId) {
            observer.error('FormId not found');
            return;
          }
          this.appFormApi.getRequestData(formId).subscribe({
            next: res => {
              this.setStoreData(res.result);
              observer.next(this.getStoreValue());
              observer.complete();
            },
            error: err => {
              observer.error(err);
            }
          });
        },
        error: err => {
          observer.error(err);
        }
      });
    });
  }

  public get hasDiscount(): boolean {
    const data = this.getStoreValue();
    const hasThirdPartyDiscount: boolean = data.previousInsurance?.thirdPartyDiscount &&
      data.previousInsurance?.thirdPartyDiscount.id !== this.constantAllService.thirdPartyDiscountDefaultValue();
    const hasDriverDiscount: boolean = data.previousInsurance?.driverDiscount &&
      data.previousInsurance?.driverDiscount.id !== this.constantAllService.driverDiscountDefaultValue();
    return (hasDriverDiscount || hasThirdPartyDiscount);
  }

  loadAuthorizedApplicationData(): void {
    super.addSubscription(this.queryParamService.getQueryParams([ThirdPartyKeysEnum.FormId], false).subscribe({
      next: param => {
        const formId = param[ThirdPartyKeysEnum.FormId];
        if (!formId) {
          return;
        }
        super.addSubscription(this.appFormApi.getApplicationForm(formId).subscribe({
          next: response => {
            this.setStoreData(response.result);
          }
        }));
      }
    }));
  }
}
