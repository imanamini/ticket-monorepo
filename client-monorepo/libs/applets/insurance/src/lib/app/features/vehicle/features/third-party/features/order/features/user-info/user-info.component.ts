import { Component, ElementRef, inject, OnInit, signal } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ThirdPartyStepperComponent } from '../../../../components/third-party-stepper/third-party-stepper.component';
import { InsAlertComponent } from '../../../../../../../../components/ins-alert/ins-alert.component';
import { UserInfoFormComponent } from '../../../../components/user-info-form/user-info-form.component';
import { BaseComponent } from '../../../../../../../../components/base/base.component';
import { RetryErrorComponent } from '../../../../../error/retry-error/retry-error.component';
import { VehicleSharedService } from '../../../../../../data-access/services/vehicle-shared.service';
import {
  ActionButtonsComponent
} from '../../../../../../../../components/action-buttons/action-buttons.component';
import { AlertSizeEnum } from '../../../../../../../../data-access/enums/alert-size.enum';
import { VehicleErrorCode } from '../../../../../../data-access/enums/vehicle-error-code.enum';
import { ThirdPartyUrlsEnum } from '../../../../data-access/enums/third-party-urls.enum';
import { IconEnum } from '../../../../../../../../data-access/enums/icon.enum';
import {
  ApplicationFormApiService
} from '../../../../../../data-access/services/third-party/application-form-api.service';
import { StoreService } from '../../../../data-access/services/store.service';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { PlatePatternChecker } from '../../../../../../util/plate-pattern-checker';
import { CloseService } from '../../../../../../data-access/services/shared/close.service';
import { UserInfoModel } from '../../../../../../data-access/models/application-form/user-info.model';
import { NgxPlateComponent } from '@digipay/ngx-plate';
import { InsuranceProductTypeEnum } from '../../../../../../../../data-access/enums/Insurance-product-type.enum';
import { ThirdPartyJourneyTypeEnum } from '../../../../data-access/enums/third-party-journey-type.enum';

@Component({
  selector: 'user-info',
  standalone: true,
  imports: [
    ThirdPartyStepperComponent,
    ActionButtonsComponent,
    UserInfoFormComponent,
    RetryErrorComponent,
    InsAlertComponent,
    NgxSkeletonLoadingComponent,
    NgxPlateComponent
  ],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss'
})
export class UserInfoComponent extends BaseComponent implements OnInit {
  constructor() {
    super();
  }

  private sharedService = inject(VehicleSharedService);
  private untypedFormBuilder = inject(UntypedFormBuilder);
  private closeService = inject(CloseService);
  private storeService = inject(StoreService);
  private applicationFormApiService = inject(ApplicationFormApiService);
  private elementRef = inject(ElementRef<HTMLElement>);

  protected readonly IconEnum = IconEnum;
  protected readonly ThirdPartyUrlsEnum = ThirdPartyUrlsEnum;
  protected readonly AlertSizeEnum = AlertSizeEnum;
  plate = '';
  isPlateEditable: boolean;
  userInfoForm = signal<UntypedFormGroup>(this.untypedFormBuilder.group({}));
  showError = false;
  userInfo = signal<UserInfoModel | null>(null);
  hasReTry = signal<boolean>(false);
  isPlateComplete = true;
  showPlateError = false;
  plateError = '';

  ngOnInit(): void {
    this.getUserInfo();
  }

  getUserInfo(): void {
    super.addSubscription(this.storeService.getStoreDataAsObservable().subscribe({
      next: response => {
        if (!response) {
          return;
        }
        this.hasReTry.set(false);
        this.userInfo.set(response.insuredParty);
        this.plate = response.license ?? '';
        this.isPlateEditable =
          !(response.license && (response.journeyType === ThirdPartyJourneyTypeEnum.SANHAB || response.journeyType === ThirdPartyJourneyTypeEnum.SANHAB_MODIFIED));
      }, error: () => {
        this.hasReTry.set(true);
      }
    }));
  }

  scrollToInvalidField(): void {
    this.scrollToElement(this.getInvalidClass());
  }

  scrollToElement(className: string): void {
    this.elementRef.nativeElement.getElementsByClassName(className)[0]?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }

  getInvalidClass(): string {
    const controls: string[] = Object.keys(this.userInfoForm().controls);
    for (let i = 0; i < controls.length; i++) {
      const control = this.userInfoForm().get(controls[i]);
      if (control.invalid) {
        return controls[i];
      }
    }
    return 'plate';
  }

  handleActiveButtonClick(): void {
    if (!(this.plate && this.isPlateComplete && PlatePatternChecker(this.plate))) {
      if (!this.plate || !this.isPlateComplete) {
        this.showPlateError = true;
        this.plateError = 'شماره پلاک خود را وارد کنید';
      }
      if (this.plate && this.isPlateComplete && !PlatePatternChecker(this.plate)) {
        this.showPlateError = true;
        this.plateError = 'شماره پلاک اشتباه است';
      }
      this.showPlateError = true;
      this.scrollToInvalidField();
      return;
    }
    this.showError = false;
    if (this.userInfoForm().invalid) {
      setTimeout(() => this.showError = true, 0);
      this.scrollToInvalidField();
      return;
    }

    super.addSubscription(this.applicationFormApiService.putInsuredParty(
      this.storeService.getFormId(),
      {
        insuredPartyDetail: {
          ...this.userInfoForm().value,
          license: this.storeService.getStoreValue().license,
          email: this.storeService.getStoreValue().insuredParty.email
        },
        requesterPartyDetail: structuredClone(this.storeService.getStoreValue().requesterParty),
        address: this.storeService.getStoreValue().address,
        license: this.plate,
      }).subscribe({
      next: () => {
        this.storeService.setStoreData({
          ...this.storeService.appDataAsAppGetModel(),
          insuredParty: {
            ...this.storeService.appDataAsAppGetModel()?.insuredParty,
            ...this.userInfoForm().value
          },
          license: this.plate,
        });
        this.sharedService.navigate(ThirdPartyUrlsEnum.UploadDocument, null, InsuranceProductTypeEnum.ThirdParty);
      },
      error: (err) => {
        if (err?.error?.error?.code === VehicleErrorCode.InappropriateAction) {
          this.sharedService.navigate(ThirdPartyUrlsEnum.State, {
            queryParamsHandling: 'merge'
          }, InsuranceProductTypeEnum.ThirdParty);
        }
      }
    }));
  }

  handleDeActiveButtonClicked(): void {
    this.sharedService.navigate('', {baseUrl: false}, InsuranceProductTypeEnum.ThirdParty);
  }

  handleCloseClicked(): void {
    this.closeService.closeWithCheckQueryParam();
  }

  handlePlateChange(plate: any): void {
    if (plate && this.isPlateComplete) {
      this.plate = plate;
      this.showPlateError = true;
    }
  }

  handleIsPlateComplete(event: any): void {
    this.isPlateComplete = event;
  }
}
