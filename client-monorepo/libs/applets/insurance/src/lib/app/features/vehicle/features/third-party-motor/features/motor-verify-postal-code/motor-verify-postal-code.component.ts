import { Component, inject, OnInit, signal } from '@angular/core';
import { ActionButtonsComponent } from '../../../../../../components/action-buttons/action-buttons.component';
import { MotorAddressFormComponent } from '../../components/motor-address-form/motor-address-form.component';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { AddressModel } from '../../../third-party/data-access/models/address.model';
import { THIRD_PARTY_MOTOR_ROUTE } from '../../data-access/constants/third-party-motor-route.const';
import { ThirdPartyMotorDirective } from '../../directives/third-party-motor.directive';
import { UserAddressModel } from '../../../../data-access/models/application-form/user-address.model';
import { InsuranceProductsEnum, ProductToUrlMapper } from '../../../../../home/data-access/constants/home.const';
import {
  ThirdPartyStepperComponent
} from '../../../third-party/components/third-party-stepper/third-party-stepper.component';
import { NgxAlert } from '@digipay/ngx-alert';
import { SnackbarService } from '@digipay/ngx-snackbar';
import {
  VERIFY_POSTAL_CODE_ERROR_DESCRIPTION_MAPPER,
  VERIFY_POSTAL_CODE_ERROR_TITLE_MAPPER
} from '../../../../../../data-access/constants/verify-postal-code-error-mapper.constant';
import { NavigationService } from '../../../../../../data-access/services/navigation.service';

@Component({
  selector: 'motor-verify-postal-code',
  standalone: true,
  imports: [
    ActionButtonsComponent,
    MotorAddressFormComponent,
    ThirdPartyStepperComponent,
    NgxAlert,
  ],
  templateUrl: './motor-verify-postal-code.component.html',
  styleUrl: './motor-verify-postal-code.component.scss'
})
export class MotorVerifyPostalCodeComponent extends ThirdPartyMotorDirective implements OnInit {

  private untypedFormBuilder = inject(UntypedFormBuilder);
  private snackService = inject(SnackbarService);
  private navigationService = inject(NavigationService);

  addressForm = signal<UntypedFormGroup>(this.untypedFormBuilder.group({}));
  address = signal<AddressModel | null>(null);
  showError = signal<boolean>(false);
  isRequesting = signal<boolean>(false);

  ngOnInit(): void {
    this.getAddressInfo();
  }

  getAddressInfo(): void {
    super.addSubscription(this.storeService.getStoreDataAsObservable().subscribe({
      next: response => {
        if (!response) {
          return;
        }
        this.address.set({
          address: response?.address?.address ?? '',
          province: response?.address?.provinceId,
          apt: response?.address?.apt ?? '',
          city: response?.address?.cityId,
          number: response?.address?.number ?? '',
          postalCode: response?.address?.postalCode ?? '',
        });
      }
    }));
  }

  onActiveButton(): void {
    if (this.addressForm().invalid) {
      this.showError.set(true);
      return;
    }
    const address: UserAddressModel = {
      apt: this.addressForm().controls.apt?.value,
      cityId: this.addressForm().controls.city?.value,
      provinceId: this.addressForm().controls.province?.value,
      address: this.addressForm().controls.address?.value,
      number: this.addressForm().controls.number?.value,
      postalCode: this.addressForm().controls.postalCode?.value,
    };
    this.isRequesting.set(true);
    super.addSubscription(this.motorApiService.putVerifyPostalCode(this.storeService.getFormId(), address).subscribe({
      next: response => {
        this.isRequesting.set(false);
        this.navigationService.replace(
          [ProductToUrlMapper[InsuranceProductsEnum.THIRD_PARTY_MOTOR] + '/' + THIRD_PARTY_MOTOR_ROUTE.OrderState],
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

  protected onNext(route: string): void {
    this.router.navigate([route], {
      relativeTo: this.route.parent,
      queryParamsHandling: 'merge'
    }).then();
  }

  protected onClose(): void {
  }

  goBack(): void {
    window.history.back();
  }
}
