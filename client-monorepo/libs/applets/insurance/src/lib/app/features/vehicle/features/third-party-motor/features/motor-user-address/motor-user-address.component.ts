import { Component, inject, OnInit, signal } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ThirdPartyMotorDirective } from '../../directives/third-party-motor.directive';
import { ActionButtonsComponent } from '../../../../../../components/action-buttons/action-buttons.component';
import { MotorAddressFormComponent } from '../../components/motor-address-form/motor-address-form.component';
import { IconEnum } from '../../../../../../data-access/enums/icon.enum';
import { NgxPlateComponent } from '@digipay/ngx-plate';
import { THIRD_PARTY_MOTOR_ROUTE } from '../../data-access/constants/third-party-motor-route.const';
import { InsuredPartyModel } from '../../../../data-access/models/application-form/insured-party.model';
import { AddressModel } from '../../../third-party/data-access/models/address.model';
import { ApplicationFormMotorModel } from '../../data-access/models/application-form-motor-response.model';
import { RetryErrorComponent } from '../../../error/retry-error/retry-error.component';

@Component({
  selector: 'motor-user-address',
  standalone: true,
  imports: [ActionButtonsComponent, ActionButtonsComponent, MotorAddressFormComponent, NgxPlateComponent, RetryErrorComponent],
  templateUrl: './motor-user-address.component.html',
  styleUrl: './motor-user-address.component.scss',
})
export class MotorUserAddressComponent extends ThirdPartyMotorDirective implements OnInit {
  private untypedFormBuilder = inject(UntypedFormBuilder);

  protected readonly IconEnum = IconEnum;

  addressForm = signal<UntypedFormGroup>(this.untypedFormBuilder.group({}));
  address = signal<AddressModel | null>(null);
  showError = signal<boolean>(false);
  plate = signal<string>('');
  hasRetry = signal<boolean>(false);

  ngOnInit(): void {
    this.getAddressInfo();
  }

  getAddressInfo(): void {
    super.addSubscription(
      this.storeService.getStoreDataAsObservable().subscribe({
        next: (response) => {
          if (!response) {
            return;
          }
          this.hasRetry.set(false);
          this.address.set({
            address: response?.address?.address ?? '',
            province: response?.address?.provinceId,
            apt: response?.address?.apt ?? '',
            city: response?.address?.cityId,
            number: response?.address?.number ?? '',
            postalCode: response?.address?.postalCode ?? '',
          });
          this.plate.set(response?.license ?? '');
        },
        error: () => {
          this.hasRetry.set(true);
        },
      }),
    );
  }

  onActiveButton(): void {
    if (this.addressForm().invalid) {
      this.showError.set(true);
      return;
    }
    const model: Partial<InsuredPartyModel> = {
      ...this.storeService.getStoreData(),
      requesterPartyDetail: {
        email: this.getCorrectEmailForJourneyCompletion(),
        birthDate: null,
        firstName: null,
        lastName: null,
        mobile: null,
        nationalCode: null,
      },
      address: {
        apt: this.addressForm().controls.apt?.value,
        cityId: this.addressForm().controls.city?.value,
        provinceId: this.addressForm().controls.province?.value,
        address: this.addressForm().controls.address?.value,
        number: this.addressForm().controls.number?.value,
        postalCode: this.addressForm().controls.postalCode?.value,
      },
      license: this.plate(),
    };
    super.addSubscription(
      this.motorApiService.updateInsuredParty(model as InsuredPartyModel, this.storeService.getFormId()).subscribe({
        next: (res) => {
          if (res.success) {
            const newStoreData: ApplicationFormMotorModel = {
              ...this.storeService.getStoreData(),
              address: model.address,
              license: model.license,
            };
            this.storeService.setStoreData(newStoreData);
            this.onNext(THIRD_PARTY_MOTOR_ROUTE.CompleteOrder);
          }
        },
      }),
    );
  }

  getCorrectEmailForJourneyCompletion(): string {
    return null;
  }

  onDeActiveButton(): void {
    this.onNext(THIRD_PARTY_MOTOR_ROUTE.UploadDocument);
  }

  protected onClose(): void {
    this.closeService.closeWithCheckQueryParam();
  }

  protected onNext(route: string): void {
    this.router
      .navigate([route], {
        relativeTo: this.route.parent,
        queryParamsHandling: 'merge',
      })
      .then();
  }
}
