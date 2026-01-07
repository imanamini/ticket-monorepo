import { Directive, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { THIRD_PARTY_MOTOR_ROUTE } from '../data-access/constants/third-party-motor-route.const';
import { BaseComponent } from '../../../../../components/base/base.component';
import { CloseService } from '../../../data-access/services/shared/close.service';
import { MotorStoreService } from '../data-access/services/motor-store.service';
import { MotorApplicationFormApiService } from '../../../data-access/services/third-party-motor/motor-application-form-api.service';
import { ApplicationFormGetResponseModel } from '../../../data-access/models/application-form/application-form-get-response.model';
import { ThirdPartyKeysEnum } from '../../third-party/data-access/enums/third-party-keys.enum';
import { ReferrerService } from '../../../../../data-access/services/referrer.service';
import { MessageService } from '@client-monorepo/common/utilities';
import moment from 'jalali-moment';
import { QueryParamService } from '../../../../../data-access/services/query-param.service';
import { ConstantAllService } from '../../../data-access/services/shared/constant-all.service';
import { tap } from 'rxjs';
import { ApplicationFormMotorModel } from '../data-access/models/application-form-motor-response.model';
import { MetricService } from '../../../../../data-access/services/metric.service';
import { VehicleSharedService } from '../../../data-access/services/vehicle-shared.service';

@Directive()
export abstract class ThirdPartyMotorDirective extends BaseComponent implements OnInit {
  protected readonly THIRD_PARTY_MOTOR_ROUTE = THIRD_PARTY_MOTOR_ROUTE;
  protected readonly router: Router = inject(Router);
  protected readonly route: ActivatedRoute = inject(ActivatedRoute);
  protected readonly closeService: CloseService = inject(CloseService);
  protected readonly motorApiService: MotorApplicationFormApiService = inject(MotorApplicationFormApiService);
  protected readonly storeService = inject(MotorStoreService);
  protected readonly referrerService = inject(ReferrerService);
  protected readonly messageService = inject(MessageService);
  protected readonly queryParamService = inject(QueryParamService);
  protected readonly constantAllService = inject(ConstantAllService);
  protected readonly metricService = inject(MetricService);
  protected readonly vehicleSharedService = inject(VehicleSharedService);

  protected abstract onClose(): void;

  protected abstract onNext(route: string): void;

  constructor() {
    super();
  }

  ngOnInit(): void {}

  protected createNewApplicationForm(): void {
    super.addSubscription(
      this.motorApiService
        .postApplicationForm({
          license: null,
          nationalCode: null,
          applicationFormId: null,
        })
        .pipe(tap(() => this.storeService.clearStore()))
        .subscribe({
          next: (res) => {
            if (!res?.result) {
              return;
            }
            const data: Partial<ApplicationFormMotorModel> = {
              applicationFormId: res.result.id,
            };
            this.storeService.setStoreData(data as ApplicationFormMotorModel);

            this.router
              .navigate([], {
                skipLocationChange: false,
                replaceUrl: true,
                queryParams: {
                  [ThirdPartyKeysEnum.FormId]: data.applicationFormId,
                  [ThirdPartyKeysEnum.Referrer]: this.referrerService?.referrer,
                },
              })
              .then();
          },
          error: (err) => {
            this.messageService.showErrorIfExists(err);
          },
        }),
    );
  }

  private getPolicyStartDate(startDate: number, endDate: number): number {
    return startDate ? startDate : endDate ? this.subtractOneYearFromDate(endDate) : null;
  }

  private subtractOneYearFromDate(dateEpoch: number): number {
    return moment(dateEpoch).locale('fa').subtract(1, 'jYear').valueOf();
  }

  private mapThirdPartyDataToMotor(thirdPartyData: any): ApplicationFormGetResponseModel {
    const carInfo = thirdPartyData?.vehicleInfo;
    const previousInsurance = thirdPartyData?.previousInsurance;

    return {
      applicationFormId: thirdPartyData?.applicationFormId || '',
      license: thirdPartyData?.license || '',
      trackingCode: thirdPartyData?.trackingCode || 0,
      price: thirdPartyData?.price || null,
      nationalCode: thirdPartyData?.nationalCode || '',
      vehicleInfo: {
        carTypeId: carInfo?.carType?.id || carInfo?.carTypeId,
        carType: carInfo?.carType?.title || carInfo?.carType,
        carUsageId: carInfo?.carUsage?.id || carInfo?.carUsageId,
        carUsage: carInfo?.carUsage?.title || carInfo?.carUsage,
        carBrandId: carInfo?.carBrand?.id || carInfo?.carBrandId,
        carBrand: carInfo?.carBrand?.title || carInfo?.carBrand,
        carBrandLogo: carInfo?.carBrand?.logo || carInfo?.carBrandLogo,
        carModelId: carInfo?.carModel?.id || carInfo?.carModelId,
        carModel: carInfo?.carModel?.title || carInfo?.carModel,
        carBuildYear: carInfo?.buildYear || carInfo?.carBuildYear,
        vehicleOwnerChanged: carInfo?.ownershipChanged || carInfo?.vehicleOwnerChanged,
        releaseDate: carInfo?.releaseDate,
      },
      previousInsuranceDetail: {
        insurerParty: {
          insurerPartyId: previousInsurance?.company?.id || thirdPartyData?.previousInsuranceDetail?.insurerParty?.insurerPartyId,
          insurerPartyName: previousInsurance?.company?.title || thirdPartyData?.previousInsuranceDetail?.insurerParty?.insurerPartyName,
          insurerPartyLogo: previousInsurance?.company?.logo || thirdPartyData?.previousInsuranceDetail?.insurerParty?.insurerPartyLogo,
        },
        startsAt: previousInsurance?.startsAt || thirdPartyData?.previousInsuranceDetail?.startsAt,
        endsAt: previousInsurance?.endsAt || thirdPartyData?.previousInsuranceDetail?.endsAt,
        thirdPartyDiscountId: previousInsurance?.thirdPartyDiscount?.id || thirdPartyData?.previousInsuranceDetail?.thirdPartyDiscountId,
        thirdPartyDiscount: previousInsurance?.thirdPartyDiscount?.title || thirdPartyData?.previousInsuranceDetail?.thirdPartyDiscount,
        driverDiscountId: previousInsurance?.driverDiscount?.id || thirdPartyData?.previousInsuranceDetail?.driverDiscountId,
        driverDiscount: previousInsurance?.driverDiscount?.title || thirdPartyData?.previousInsuranceDetail?.driverDiscount,
        propertyDamageId: previousInsurance?.propertyDamage?.id || thirdPartyData?.previousInsuranceDetail?.propertyDamageId,
        propertyDamage: previousInsurance?.propertyDamage?.title || thirdPartyData?.previousInsuranceDetail?.propertyDamage,
        healthDamageId: previousInsurance?.healthDamage?.id || thirdPartyData?.previousInsuranceDetail?.healthDamageId,
        healthDamage: previousInsurance?.healthDamage?.title || thirdPartyData?.previousInsuranceDetail?.healthDamage,
        driverDamageId: previousInsurance?.driverDamage?.id || thirdPartyData?.previousInsuranceDetail?.driverDamageId,
        driverDamage: previousInsurance?.driverDamage?.title || thirdPartyData?.previousInsuranceDetail?.driverDamage,
        insuranceNumber: previousInsurance?.insuranceNumber || thirdPartyData?.previousInsuranceDetail?.insuranceNumber,
      },
      currentInsurerParty: thirdPartyData?.currentInsurerParty || null,
      durationId: thirdPartyData?.duration?.id || thirdPartyData?.durationId || 0,
      duration: thirdPartyData?.duration?.title || thirdPartyData?.duration || '',
      coverageRateId: thirdPartyData?.coverageRate?.id || thirdPartyData?.coverageRateId || 0,
      coverageRate: thirdPartyData?.coverageRate?.title || thirdPartyData?.coverageRate || '',
      priceOptions: thirdPartyData?.priceOptions || [],
      journeyType: thirdPartyData?.journeyType,
      state: thirdPartyData?.state || null,
      address: thirdPartyData?.address || null,
      insuredParty: thirdPartyData?.insuredParty || null,
      requesterParty: thirdPartyData?.requesterParty || null,
      documents: thirdPartyData?.documents || [],
      requiredDocuments: thirdPartyData?.requiredDocuments || [],
    } as ApplicationFormGetResponseModel;
  }

  protected onPrevious(): void {
    this.closeService.close();
  }
}
