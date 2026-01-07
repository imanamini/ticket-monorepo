import { Component, inject, OnInit, signal } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ThirdPartyStepperComponent } from '../../../../components/third-party-stepper/third-party-stepper.component';
import { AddressFormComponent } from '../../../../components/address-form/address-form.component';
import { RetryErrorComponent } from '../../../../../error/retry-error/retry-error.component';
import { BaseComponent } from '../../../../../../../../components/base/base.component';
import { VehicleSharedService } from '../../../../../../data-access/services/vehicle-shared.service';
import { ActionButtonsComponent } from '../../../../../../../../components/action-buttons/action-buttons.component';
import { ThirdPartyUrlsEnum } from '../../../../data-access/enums/third-party-urls.enum';
import { IconEnum } from '../../../../../../../../data-access/enums/icon.enum';
import { AddressModel } from '../../../../data-access/models/address.model';
import { StoreService } from '../../../../data-access/services/store.service';
import { ApplicationFormApiService } from '../../../../../../data-access/services/third-party/application-form-api.service';
import { VehicleErrorCode } from '../../../../../../data-access/enums/vehicle-error-code.enum';
import { CloseService } from '../../../../../../data-access/services/shared/close.service';
import { InsuredPartyModel } from '../../../../../../data-access/models/application-form/insured-party.model';
import { NgxPlateComponent } from '@digipay/ngx-plate';
import { InsuranceProductTypeEnum } from '../../../../../../../../data-access/enums/Insurance-product-type.enum';

@Component({
  selector: 'user-address',
  standalone: true,
  imports: [ActionButtonsComponent, ThirdPartyStepperComponent, AddressFormComponent, RetryErrorComponent, NgxPlateComponent],
  templateUrl: './user-address.component.html',
  styleUrl: './user-address.component.scss',
})
export class UserAddressComponent extends BaseComponent implements OnInit {
  constructor() {
    super();
  }

  private sharedService = inject(VehicleSharedService);
  private untypedFormBuilder = inject(UntypedFormBuilder);
  private closeService = inject(CloseService);
  private storeService = inject(StoreService);
  private applicationFormApiService = inject(ApplicationFormApiService);

  protected readonly ThirdPartyUrlsEnum = ThirdPartyUrlsEnum;
  protected readonly IconEnum = IconEnum;
  plate: string | null = null;
  addressForm: UntypedFormGroup = this.untypedFormBuilder.group({});
  showError = false;
  address: AddressModel | null = null;
  hasReTry = signal<boolean>(false);

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    if (!this.storeService.getFormId()) {
      return;
    }
    super.addSubscription(
      this.storeService.getStoreDataAsObservable().subscribe({
        next: (storeData) => {
          if (!storeData) {
            return;
          }
          this.hasReTry.set(false);
          this.address = {
            address: storeData?.address?.address ?? '',
            province: storeData?.address?.provinceId,
            apt: storeData?.address?.apt ?? '',
            city: storeData?.address?.cityId,
            number: storeData?.address?.number ?? '',
            postalCode: storeData?.address?.postalCode ?? '',
          };

          if (!storeData.license && storeData.license === '') {
            return;
          }

          this.plate = storeData.license;
        },
        error: () => {
          this.hasReTry.set(true);
        },
      }),
    );
  }

  handleActiveButtonClicked(): void {
    if (this.addressForm.invalid) {
      this.showError = true;
      return;
    }
    const insuredParty: InsuredPartyModel = {
      address: {
        ...this.storeService.getStoreValue().address,
        apt: this.addressForm.controls.apt?.value,
        cityId: this.addressForm.controls.city?.value,
        provinceId: this.addressForm.controls.province?.value,
        address: this.addressForm.controls.address?.value,
        number: this.addressForm.controls.number?.value,
        postalCode: this.addressForm.controls.postalCode?.value,
      },
      requesterPartyDetail: {
        ...structuredClone(this.storeService.getStoreValue().requesterParty),
        email: this.getCorrectEmailForJourneyCompletion(),
      },
      insuredPartyDetail: this.storeService.getStoreValue().insuredParty,
      license: this.storeService.getStoreValue().license,
    };
    super.addSubscription(
      this.applicationFormApiService.putInsuredParty(this.storeService.getFormId(), insuredParty).subscribe({
        next: () => {
          this.storeService.setStoreData({
            ...this.storeService.appDataAsAppGetModel(),
            address: {
              ...this.storeService.appDataAsAppGetModel()?.address,
              apt: this.addressForm?.controls.apt?.value,
              cityId: this.addressForm?.controls.city?.value,
              provinceId: this.addressForm?.controls.province?.value,
              address: this.addressForm?.controls.address?.value,
              number: this.addressForm?.controls.number?.value,
              postalCode: this.addressForm.controls.postalCode?.value,
            },
          });
          this.sharedService.navigate(ThirdPartyUrlsEnum.Complete, null, InsuranceProductTypeEnum.ThirdParty);
        },
        error: (err) => {
          if (err?.error?.error?.code === VehicleErrorCode.InappropriateAction) {
            this.sharedService.navigate(
              ThirdPartyUrlsEnum.State,
              {
                queryParamsHandling: 'merge',
              },
              InsuranceProductTypeEnum.ThirdParty,
            );
          }
        },
      }),
    );
  }

  getCorrectEmailForJourneyCompletion(): string {
    return null;
  }

  handleDeActiveButtonClicked(): void {
    this.sharedService.navigate(ThirdPartyUrlsEnum.UploadDocument, null, InsuranceProductTypeEnum.ThirdParty);
  }

  handleCloseClicked(): void {
    this.closeService.closeWithCheckQueryParam();
  }
}
