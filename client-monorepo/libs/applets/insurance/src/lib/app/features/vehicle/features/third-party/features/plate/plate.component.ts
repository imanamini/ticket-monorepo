import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { take } from 'rxjs/operators';
import { DigipayDividerComponent } from '../../../../components/digipay-divider/digipay-divider.component';
import { EnterPlateDataModel } from '../../components/enter-plate/models/enter-plate-data.model';
import { InsIconComponent } from '../../../../components/ins-icon/ins-icon.component';
import { LoginService } from '../../../../../../data-access/services/user-services/login.service';
import { PlateApiService } from '../../../../data-access/services/third-party/plate-api.service';
import { QueryParamService } from '../../../../../../data-access/services/query-param.service';
import { HttpStatusCodeEnum } from '../../../../../../data-access/enums/http-status-code.enum';
import { EnterPlateComponent } from '../../components/enter-plate/enter-plate.component';
import { BaseComponent } from '../../../../../../components/base/base.component';
import { VehicleSharedService } from '../../../../data-access/services/vehicle-shared.service';
import { ActionButtonsComponent } from '../../../../../../components/action-buttons/action-buttons.component';
import { MessageService } from '@client-monorepo/common/utilities';
import { ThirdPartyErrorCodes } from '../../data-access/enums/third-party-error-codes';
import { BottomSheetService } from '../../../../../../data-access/services/bottom-sheet.service';
import { ThirdPartyUrlsEnum } from '../../data-access/enums/third-party-urls.enum';
import { ThirdPartyKeysEnum } from '../../data-access/enums/third-party-keys.enum';
import { IconEnum } from '../../../../../../data-access/enums/icon.enum';
import { PlateService } from '../../data-access/services/plate.service';
import {
  ApplicationFormGetResponseModel
} from '../../../../data-access/models/application-form/application-form-get-response.model';
import { ThirdPartyJourneyTypeEnum } from '../../data-access/enums/third-party-journey-type.enum';
import { QueryParamKeysEnum } from '../../../../../home/query-param-keys.enum';
import { ApplicationFormApiService } from '../../../../data-access/services/third-party/application-form-api.service';
import { StoreService } from '../../data-access/services/store.service';
import { ReferrerService } from '../../../../../../data-access/services/referrer.service';
import { CloseService } from '../../../../data-access/services/shared/close.service';
import { InsuranceProductTypeEnum } from '../../../../../../data-access/enums/Insurance-product-type.enum';
import { AuthService } from '@client-monorepo/common/user';
import { BottomSheetBoxComponent } from '../../../../../../components/bottom-sheet-box/bottom-sheet-box.component';
import {
  PlateListBottomSheetComponent
} from '../../components/plate-list-bottom-sheet/plate-list-bottom-sheet.component';

@Component({
  selector: 'plate',
  standalone: true,
  imports: [
    EnterPlateComponent,
    NgxSkeletonLoadingComponent,
    DigipayDividerComponent,
    InsIconComponent,
    ActionButtonsComponent
  ],
  templateUrl: './plate.component.html',
  styleUrl: './plate.component.scss',
})
export class PlateComponent extends BaseComponent implements OnInit {

  private router = inject(Router);
  private referrerService = inject(ReferrerService);
  private storeService = inject(StoreService);
  private appFormApiService = inject(ApplicationFormApiService);
  private sharedService = inject(VehicleSharedService);
  private messageService = inject(MessageService);
  private bottomSheetService = inject(BottomSheetService);
  private authService = inject(AuthService);
  private loginService = inject(LoginService);
  private queryParamService = inject(QueryParamService);
  private plateService = inject(PlateService);
  private plateApiService = inject(PlateApiService);
  private closeService = inject(CloseService);
  activatedRoute = inject(ActivatedRoute);

  protected readonly IconEnum = IconEnum;

  plateData: EnterPlateDataModel = {
    plate: '',
    nationalCode: ''
  };
  isValidPlateData = false;
  activeButtonLoading = false;
  showError = false;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.queryParamService.deleteQueryParams([ThirdPartyKeysEnum.NoPlate]).then();
    this.checkForPlatesList();
  }

  checkForPlatesList(): void {
    super.addSubscription(
      this.queryParamService.getQueryParams([ThirdPartyKeysEnum.IsPlatesListOpen], false).subscribe({
        next: params => {
          if (params[ThirdPartyKeysEnum.IsPlatesListOpen]) {
            setTimeout(() => this.handleClickedOnMyPlates(), 1000);
          }
        }
      })
    );

    const fragment = this.activatedRoute.snapshot.fragment;
    if (fragment === 'platesListOpen' && this.loginService.isLoggedIn) {
      setTimeout(() => this.handleClickedOnMyPlates(), 1000);
    }
  }

  insertPlateInUserPlates(): void {
    if (this.activeButtonLoading) {
      return;
    }
    this.activeButtonLoading = true;
    super.addSubscription(this.plateApiService.insertPlate({
      plate: this.plateData.plate,
      nationalCode: this.plateData.nationalCode
    }).pipe(
      take(1),
    ).subscribe({
      next: () => {
        this.sharedService.navigate(ThirdPartyUrlsEnum.Sanhab, null, InsuranceProductTypeEnum.ThirdParty);
        this.activeButtonLoading = false;
      }, error: (e) => {
        if (e.error?.error?.code === ThirdPartyErrorCodes.PLATE_ALREADY_EXISTS ||
          e.error?.result?.status === ThirdPartyErrorCodes.AUTHORIZATION_PROTECTED_ROUTE_EXCEPTION ||
          e.status === HttpStatusCodeEnum.Forbidden ||
          e.status === HttpStatusCodeEnum.Unauthorized) {
          this.sharedService.navigate(ThirdPartyUrlsEnum.Sanhab, null, InsuranceProductTypeEnum.ThirdParty);
          this.activeButtonLoading = false;
        } else {
          this.messageService.showErrorIfExists(e);
          this.activeButtonLoading = false;
        }
      }
    }));
  }

  handleEnterPlateValidity(event: boolean): void {
    this.isValidPlateData = event;
  }

  handleClickedOnMyPlates(): void {
    if (this.authService.isLoggedIn) {
      this.router.navigate([], {
        fragment: 'platesListOpen'
      }).then(() => {
        super.addSubscription(
          this.bottomSheetService.open(BottomSheetBoxComponent, {
            name: 'PlateListBottomSheet',
            component: PlateListBottomSheetComponent
          }).afterDismissed().subscribe({
            next: (hasManuallyDismissed) => {
              if (!hasManuallyDismissed) {
                this.router.navigate([], {
                  fragment: null
                });
              }
            }
          })
        );
      });
    } else {
      this.loginService.routeToLoginPage();
    }
  }

  handleActiveClicked(): void {
    if (!this.isValidPlateData) {
      this.showError = true;
      return;
    }
    this.plateService.setPlateData(this.plateData);
    if (this.authService.isLoggedIn) {
      this.insertPlateInUserPlates();
    } else {
      this.sharedService.navigate(ThirdPartyUrlsEnum.Sanhab, null, InsuranceProductTypeEnum.ThirdParty);
    }
  }

  handleDeActiveClicked(): void {
    this.closeService.close();
  }

  dataChanged(): void {
    this.showError = false;
  }

  handleCloseClicked(): void {
    this.closeService.close();
  }

  public onNoPlate(): void {
    super.addSubscription(this.appFormApiService
      .postApplicationForm({
        license: null,
        nationalCode: null,
        applicationFormId: this.storeService.getFormId()
      })
      .subscribe({
        next: (res) => {
          if (!res?.result) {
            return;
          }

          const {car, insurer} = res.result;
          const data: ApplicationFormGetResponseModel = {
            applicationFormId: res?.result?.id,
            price: null,
            trackingCode: null,
            vehicleInfo: {
              carType: car?.carType?.title,
              carTypeId: car?.carType?.id,
              carUsage: car?.carUsage?.title,
              carUsageId: car?.carUsage?.id,
              carModel: car?.carModel?.title,
              carModelId: car?.carModel?.id,
              carBrand: car?.carBrand?.title,
              carBuildYear: car?.buildYear,
              carBrandLogo: car?.carBrand?.logo,
              vehicleOwnerChanged: car?.vehicleOwnershipChanged,
              carBrandId: car?.carBrand?.id
            },
            currentInsurerParty: null,
            journeyType: (car || insurer)
              ? ThirdPartyJourneyTypeEnum.SANHAB : ThirdPartyJourneyTypeEnum.MANUAL,
            previousInsuranceDetail: {
              insuranceNumber: insurer?.insuranceNumber,
              insurerParty: {
                insurerPartyName: insurer?.company?.name,
                insurerPartyId: insurer?.company?.id,
                insurerPartyLogo: insurer?.company?.logo
              },
              startsAt: insurer?.startDate,
              endsAt: insurer?.endDate,
              driverDiscount: insurer?.driverDiscount?.amount?.toString(),
              driverDiscountId: insurer?.driverDiscount?.id,
              thirdPartyDiscount: insurer?.thirdPartyDiscount?.amount?.toString(),
              thirdPartyDiscountId: insurer?.thirdPartyDiscount?.id,
              propertyDamage: insurer?.propertyDamage?.title,
              propertyDamageId: insurer?.propertyDamage?.id,
              healthDamage: insurer?.healthDamage?.title,
              healthDamageId: insurer?.healthDamage?.id,
              driverDamage: insurer?.driverDamage?.title,
              driverDamageId: insurer?.driverDamage?.id,
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
          this.plateService.setPlateData({plate: null, nationalCode: null});
          this.queryParamService.addQueryParams({
            [ThirdPartyKeysEnum.FormId]: data.applicationFormId,
            [ThirdPartyKeysEnum.Referrer]: this.referrerService?.referrer,
            [QueryParamKeysEnum.JourneyType]: 'noSanhab'
          }).then(() => {
            this.referrerService.entryFunnelSource = 'noSanhab';
            this.sharedService.navigate(ThirdPartyUrlsEnum.CarInfo, null, InsuranceProductTypeEnum.ThirdParty);
          });
        },
        error: (err) => {
          this.messageService.showErrorIfExists(err);
          this.sharedService.navigate(ThirdPartyUrlsEnum.ThirdParty, null, InsuranceProductTypeEnum.ThirdParty);
        }
      }));
  }
}
