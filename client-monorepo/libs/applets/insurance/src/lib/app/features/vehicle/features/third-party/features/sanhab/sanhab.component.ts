import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';
import { ApplicationFormApiService } from '../../../../data-access/services/third-party/application-form-api.service';
import { QueryParamService } from '../../../../../../data-access/services/query-param.service';
import { ThirdPartyJourneyTypeEnum } from '../../data-access/enums/third-party-journey-type.enum';
import { BaseComponent } from '../../../../../../components/base/base.component';
import { VehicleSharedService } from '../../../../data-access/services/vehicle-shared.service';
import { ReferrerService } from '../../../../../../data-access/services/referrer.service';
import { ThirdPartyUrlsEnum } from '../../data-access/enums/third-party-urls.enum';
import { ThirdPartyKeysEnum } from '../../data-access/enums/third-party-keys.enum';
import { PlateService } from '../../data-access/services/plate.service';
import { StoreService } from '../../data-access/services/store.service';
import {
  ApplicationFormGetResponseModel
} from '../../../../data-access/models/application-form/application-form-get-response.model';
import { QueryParamKeysEnum } from '../../../../../home/query-param-keys.enum';
import {
  ApplicationFormPostResponseModel
} from '../../../../data-access/models/application-form/application-form-post-response.model';
import { EditSanhabModalEnum } from '../../../../data-access/enums/edit-sanhab-modal.enum';
import moment from 'jalali-moment';
import { NgxWaitingStepperComponent, WaitingStepperStateEnum } from '@digipay/ngx-waiting-stepper';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { TimerCountDownModel } from '@digipay/ngx-count-down';
import { DpxService } from '../../../../../../data-access/services/dpx.service';
import { StoreModel } from '../../data-access/models/store.model';
import { InsuranceProductTypeEnum } from '../../../../../../data-access/enums/Insurance-product-type.enum';
import { MessageService } from '@client-monorepo/common/utilities';

@Component({
  selector: 'sanhab',
  standalone: true,
  imports: [NgxSpinnerModule, NgxWaitingStepperComponent, NgxStatusResultModule],
  templateUrl: './sanhab.component.html',
  styleUrl: './sanhab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SanhabComponent extends BaseComponent implements OnInit {
  timer = signal<TimerCountDownModel>({
    timerType: 'with-badge',
    timeInSeconds: 16,
  });
  waitingStepperState = signal<WaitingStepperStateEnum>(WaitingStepperStateEnum.PROGRESS);

  private appFormApiService = inject(ApplicationFormApiService);
  private sharedService = inject(VehicleSharedService);
  private queryParamService = inject(QueryParamService);
  private referrerService = inject(ReferrerService);
  private dpxService = inject(DpxService);
  private plateService = inject(PlateService);
  private storeService = inject(StoreService);
  private messageService = inject(MessageService);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.checkSanHab();
  }

  checkSanHab(): void {
    if (this.hasLandedDirectly()) {
      this.checkSanhabWhileLandedDirectly();
      return;
    }
    this.callApplicationForm();
  }

  callApplicationForm(): void {
    const plate = this.plateService.getPlateData();
    if (!plate) {
      return;
    }

    super.addSubscription(
      this.queryParamService.getQueryParams([ThirdPartyKeysEnum.FormId], false).subscribe({
        next: (param) => {
          this.queryParamService.removeAllQueryParams().then(() => {
            super.addSubscription(
              this.appFormApiService
                .postApplicationForm({
                  license: plate.plate,
                  nationalCode: plate.nationalCode,
                  applicationFormId: param[ThirdPartyKeysEnum.FormId],
                })
                .subscribe({
                  next: (res) => {
                    if (!res?.result) {
                      return;
                    }
                    const data: ApplicationFormGetResponseModel = {
                      applicationFormId: res?.result?.id,
                      price: null,
                      trackingCode: null,
                      vehicleInfo: {
                        carType: res?.result?.car?.carType?.title,
                        carTypeId: res?.result?.car?.carType?.id,
                        carUsage: res?.result?.car?.carUsage?.title,
                        carUsageId: res?.result?.car?.carUsage?.id,
                        carModel: res?.result?.car?.carModel?.title,
                        carModelId: res?.result?.car?.carModel?.id,
                        carBrand: res?.result?.car?.carBrand?.title,
                        carBuildYear: this.getCorrectBuildYear(res?.result?.car?.buildYear),
                        carBrandLogo: res?.result?.car?.carBrand?.logo,
                        vehicleOwnerChanged: res?.result?.car?.vehicleOwnershipChanged,
                        carBrandId: res?.result?.car?.carBrand?.id,
                      },
                      currentInsurerParty: null,
                      journeyType:
                        res.result?.car || res.result?.insurer ? ThirdPartyJourneyTypeEnum.SANHAB : ThirdPartyJourneyTypeEnum.MANUAL,
                      previousInsuranceDetail: {
                        insuranceNumber: res?.result?.insurer?.insuranceNumber,
                        insurerParty: {
                          insurerPartyName: res?.result?.insurer?.company?.name,
                          insurerPartyId: res?.result?.insurer?.company?.id,
                          insurerPartyLogo: res?.result?.insurer?.company?.logo,
                        },
                        startsAt: this.getPolicyStartDate(res?.result?.insurer?.startDate, res?.result?.insurer?.endDate),
                        endsAt: res?.result?.insurer?.endDate,
                        driverDiscount: res?.result?.insurer?.driverDiscount?.amount?.toString(),
                        driverDiscountId: res?.result?.insurer?.driverDiscount?.id,
                        thirdPartyDiscount: res?.result?.insurer?.thirdPartyDiscount?.amount?.toString(),
                        thirdPartyDiscountId: res?.result?.insurer?.thirdPartyDiscount?.id,
                        propertyDamage: res?.result?.insurer?.propertyDamage?.title,
                        propertyDamageId: res?.result?.insurer?.propertyDamage?.id,
                        healthDamage: res?.result?.insurer?.healthDamage?.title,
                        healthDamageId: res?.result?.insurer?.healthDamage?.id,
                        driverDamage: res?.result?.insurer?.driverDamage?.title,
                        driverDamageId: res?.result?.insurer?.driverDamage?.id,
                      },
                      address: null,
                      priceOptions: null,
                      insuredParty: null,
                      requesterParty: null,
                      coverageRate: null,
                      documents: null,
                      requiredDocuments: null,
                      coverageRateId: null,
                      duration: null,
                      durationId: null,
                      license: null,
                      nationalCode: null,
                      state: null,
                    };
                    this.storeService.setStoreData(data);

                    this.queryParamService
                      .addQueryParams({
                        [ThirdPartyKeysEnum.FormId]: data.applicationFormId,
                        [ThirdPartyKeysEnum.Referrer]: this.referrerService?.referrer,
                        [QueryParamKeysEnum.JourneyType]: data.journeyType ? 'noSanhab' : 'sanhab',
                      })
                      .then(() => {
                        if (data.journeyType === ThirdPartyJourneyTypeEnum.MANUAL) {
                          this.routeToCarInfoWithNoSanhab();
                          return;
                        }
                        this.handleSuccessSanhab(() => {
                          this.sharedService
                            .navigate(
                              ThirdPartyUrlsEnum.SanhabCarInfo,
                              {
                                fragment: this.setEditFragment(res.result),
                                replace: true,
                              },
                              InsuranceProductTypeEnum.ThirdParty,
                            )
                            .then(() => {
                              this.referrerService.entryFunnelSource = 'sanhab';
                            });
                        });
                      });
                  },
                  error: (err) => {
                    this.messageService.showErrorIfExists(err);
                    this.handleFailedSanhab(() =>
                      this.sharedService.navigate(ThirdPartyUrlsEnum.ThirdParty, null, InsuranceProductTypeEnum.ThirdParty),
                    );
                  },
                }),
            );
          });
        },
      }),
    );
  }

  checkSanhabWhileLandedDirectly(): void {
    this.storeService.loadUnauthorizedApplicationDataObservable().subscribe({
      next: (storedItem: StoreModel) => {
        if (storedItem) {
          this.queryParamService
            .addQueryParams({
              [ThirdPartyKeysEnum.FormId]: this.storeService.getFormId(),
              [ThirdPartyKeysEnum.Referrer]: this.referrerService?.referrer,
              [QueryParamKeysEnum.JourneyType]: storedItem.journeyType === 0 ? 'sanhab' : 'noSanhab',
            })
            .then(() => {
              this.plateService.setPlateData({
                plate: storedItem.license,
                nationalCode: null,
              });
              if (storedItem.journeyType === ThirdPartyJourneyTypeEnum.MANUAL) {
                this.routeToCarInfoWithNoSanhab();
                return;
              }
              this.handleSuccessSanhab(() => {
                this.sharedService.navigate(
                  ThirdPartyUrlsEnum.SanhabCarInfo,
                  {
                    fragment: this.setEditFragmentWhileLandedDirectly(storedItem),
                    replace: true,
                  },
                  InsuranceProductTypeEnum.ThirdParty,
                );
                this.referrerService.entryFunnelSource = 'sanhab';
              });
            });
        } else {
          this.routeToCarInfoWithNoSanhab();
        }
      },
      error: (err) => {
        this.callApplicationForm();
      },
    });
  }

  hasLandedDirectly(): boolean {
    return this.dpxService.IsEnteredFromWebsite;
  }

  handleFailedSanhab(action: () => void): void {
    this.waitingStepperState.set(WaitingStepperStateEnum.FAILED);
    setTimeout(() => action(), 1500);
  }

  handleSuccessSanhab(action: () => void): void {
    this.waitingStepperState.set(WaitingStepperStateEnum.SUCCESS);
    setTimeout(() => action(), 1000);
  }

  private setEditFragment(res: ApplicationFormPostResponseModel): string {
    return res.car === null || res.car?.isIncludeNullData
      ? EditSanhabModalEnum.editCar
      : res.insurer === null || res.insurer?.isIncludeNullData
        ? EditSanhabModalEnum.editInsurer
        : null;
  }

  private setEditFragmentWhileLandedDirectly(item: StoreModel): string {
    if (!item) {
      return EditSanhabModalEnum.editCar;
    }
    const {previousInsurance, vehicleInfo} = item;
    if (!vehicleInfo.carUsage || !vehicleInfo.buildYear || !vehicleInfo.carBrand || !vehicleInfo.carModel) {
      return EditSanhabModalEnum.editCar;
    }
    if (
      !previousInsurance ||
      !previousInsurance?.driverDamage ||
      !previousInsurance?.healthDamage ||
      !previousInsurance?.propertyDamage ||
      !previousInsurance?.driverDiscount ||
      !previousInsurance?.thirdPartyDiscount ||
      !previousInsurance?.company ||
      !previousInsurance?.endsAt
    ) {
      return EditSanhabModalEnum.editInsurer;
    }
    return null;
  }

  private routeToCarInfoWithNoSanhab(): void {
    this.referrerService.entryFunnelSource = 'noSanhab';
    this.handleFailedSanhab(() =>
      this.sharedService.navigate(ThirdPartyUrlsEnum.CarInfo, {replace: true}, InsuranceProductTypeEnum.ThirdParty),
    );
  }

  private getPolicyStartDate(startDate: number, endDate: number): number {
    return startDate ? startDate : endDate ? this.subtractOneYearFromDate(endDate) : null;
  }

  private subtractOneYearFromDate(dateEpoch: number): number {
    return moment(dateEpoch).locale('fa').subtract(1, 'jYear').valueOf();
  }

  private getCorrectBuildYear(buildYear: string): string {
    return !buildYear ? null : (+buildYear >= 1367 ? buildYear : '1367');
  }
}
