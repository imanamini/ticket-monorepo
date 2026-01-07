import { Component, inject, signal } from '@angular/core';
import {
  ActionButtonsComponent
} from '../../../../../../../../components/action-buttons/action-buttons.component';
import { AddressFormComponent } from '../../../../components/address-form/address-form.component';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { StoreService } from '../../../../data-access/services/store.service';
import {
  ApplicationFormApiService
} from '../../../../../../data-access/services/third-party/application-form-api.service';
import { AddressModel } from '../../../../data-access/models/address.model';
import { BaseComponent } from '../../../../../../../../components/base/base.component';
import { UserAddressModel } from '../../../../../../data-access/models/application-form/user-address.model';
import { ThirdPartyUrlsEnum } from '../../../../data-access/enums/third-party-urls.enum';
import { InsuranceProductsEnum, ProductToUrlMapper } from '../../../../../../../home/data-access/constants/home.const';
import { ThirdPartyStepperComponent } from '../../../../components/third-party-stepper/third-party-stepper.component';
import { NgxAlert } from '@digipay/ngx-alert';
import { SnackbarService } from '@digipay/ngx-snackbar';
import {
  VERIFY_POSTAL_CODE_ERROR_DESCRIPTION_MAPPER,
  VERIFY_POSTAL_CODE_ERROR_TITLE_MAPPER
} from '../../../../../../../../data-access/constants/verify-postal-code-error-mapper.constant';
import { NavigationService } from '../../../../../../../../data-access/services/navigation.service';

@Component({
  selector: 'verify-postal-code',
  standalone: true,
  imports: [
    ActionButtonsComponent,
    AddressFormComponent,
    ThirdPartyStepperComponent,
    NgxAlert,
  ],
  templateUrl: './verify-postal-code.component.html',
  styleUrl: './verify-postal-code.component.scss'
})
export class VerifyPostalCodeComponent extends BaseComponent {

  private untypedFormBuilder = inject(UntypedFormBuilder);
  private storeService = inject(StoreService);
  private applicationFormApiService = inject(ApplicationFormApiService);
  private snackService = inject(SnackbarService);
  private navigationService = inject(NavigationService);

  addressForm: UntypedFormGroup = this.untypedFormBuilder.group({});
  showError = signal<boolean>(false);
  address: AddressModel | null = null;
  isRequesting = signal<boolean>(false);

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    super.addSubscription(this.storeService.getStoreDataAsObservable().subscribe({
      next: storeData => {
        if (!storeData) {
          return;
        }
        this.address = {
          address: storeData?.address?.address ?? '',
          province: storeData?.address?.provinceId,
          apt: storeData?.address?.apt ?? '',
          city: storeData?.address?.cityId,
          number: storeData?.address?.number ?? '',
          postalCode: storeData?.address?.postalCode ?? '',
        };
      }
    }));
  }

  handleActiveButtonClicked(): void {
    if (this.addressForm.invalid) {
      this.showError.set(true);
      return;
    }
    const address: UserAddressModel = {
      apt: this.addressForm.controls.apt?.value,
      cityId: this.addressForm.controls.city?.value,
      provinceId: this.addressForm.controls.province?.value,
      address: this.addressForm.controls.address?.value,
      number: this.addressForm.controls.number?.value,
      postalCode: this.addressForm.controls.postalCode?.value,
    };
    this.isRequesting.set(true);
    super.addSubscription(this.applicationFormApiService.putVerifyPostalCode(this.storeService.getFormId(), address).subscribe({
      next: response => {
        this.isRequesting.set(false);
        this.navigationService.replace(
          [ProductToUrlMapper[InsuranceProductsEnum.THIRD_PARTY] + '/' + ThirdPartyUrlsEnum.State],
          {queryParamsHandling: 'merge'});
      },
      error: error => {
        this.isRequesting.set(false);
        const errorCode = error?.error?.error?.code;
        this.snackService.openSnackBar({
          message: VERIFY_POSTAL_CODE_ERROR_TITLE_MAPPER[errorCode] ?? 'دسترسی نامعتبر',
          description: VERIFY_POSTAL_CODE_ERROR_DESCRIPTION_MAPPER[errorCode] ?? error?.error?.error?.title ?? 'خطایی در سامانه رخ داده است.',
          duration: 4000,
          status: 'error'
        });
      }
    }));
  }

  goBack(): void {
    window.history.back();
  }
}
