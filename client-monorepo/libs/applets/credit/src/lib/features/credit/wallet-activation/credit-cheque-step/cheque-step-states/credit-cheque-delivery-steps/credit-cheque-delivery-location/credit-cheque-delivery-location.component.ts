import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, model, OnInit, output, signal } from '@angular/core';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { CreditAppBarComponent } from '../../../../../components/credit-app-bar/credit-app-bar.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldOption, UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { CreditScrollableViewComponent } from '../../../../../components/credit-scrollable-view/credit-scrollable-view.component';
import { CreditApiService } from '../../../../../data-access/services/credit-api.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ChequeDeliveryCity,
  ChequeDeliveryProvince,
  ChequeDeliverySteps,
  ChequeStepDeliveryMethod,
  SelectedAddressModel,
} from '../../../../../data-access/models/credit/activation/cheque-step/cheque-step-delivery.model';
import { UserAddress } from '../../../../../data-access/models/credit/profile/credit-profile-response.model';
import { CreditChequeStepService } from '../../../services/credit-cheque-step.service';
import { CreditChequeDeliveryMethodsBottomSheetComponent } from '../credit-cheque-delivery-methods-bottomsheet/credit-cheque-delivery-methods-bottom-sheet.component';
import { CreditStepperComponent } from '../../../../../components/credit-stepper/credit-stepper.component';
import { CreditPageLoadingComponent } from '../../../../../components/credit-page-loading/credit-page-loading.component';
import { MessageService } from '../../../../../data-access/services/message.service';
import { areStringsSimilar } from '../../../../../data-access/utils/string-comparator';
import { CreditChequeDeliveryDateTimePickerBottomSheetComponent } from '../credit-cheque-delivery-date-time-picker-bottomsheet/credit-cheque-delivery-date-time-picker-bottom-sheet.component';

@Component({
  selector: 'app-credit-cheque-delivery-location',
  templateUrl: './credit-cheque-delivery-location.component.html',
  styleUrls: ['./credit-cheque-delivery-location.component.scss'],
  standalone: true,
  imports: [
    CreditAppBarComponent,
    ReactiveFormsModule,
    UiFormFieldBuilderModule,
    NgxButtonComponent,
    NgxTrackableIdDirective,
    CreditScrollableViewComponent,
    CreditStepperComponent,
    CreditPageLoadingComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditChequeDeliveryLocationComponent implements OnInit {
  form!: FormGroup;

  showLoading = signal(false);
  userAddresses = signal<UserAddress[]>([]);
  provinces = signal<ChequeDeliveryProvince[]>([]);
  provinceOptions = signal<FormFieldOption[]>([]);
  cityOptions = signal<FormFieldOption[]>([]);
  selectedCity = signal<ChequeDeliveryCity | undefined>(undefined);
  similarAddressFound = signal(false);

  back = output();
  goToStep = output<ChequeDeliverySteps>();

  private bottomSheetService = inject(NgxBottomSheetService);
  private formBuilder = inject(FormBuilder);
  private creditApiService = inject(CreditApiService);
  private destroyRef = inject(DestroyRef);
  private creditChequeStepService = inject(CreditChequeStepService);
  private messageService = inject(MessageService);

  selectedDeliveryMethod = computed(() => this.creditChequeStepService.selectedChequeDeliveryMethod());
  showAddressDetails = computed(() => this.selectedDeliveryMethod() === ChequeStepDeliveryMethod.COURIER);
  selectedAddress = computed<SelectedAddressModel | undefined>(
    () => this.creditChequeStepService.chequeStepDeliveryReserveInfo()?.pickupAddress,
  );

  editMode = model<boolean>(!!this.selectedAddress());
  subtitle = computed(
    () =>
      `در این مرحله، باید اصل چک را به دیجی‌پی تحویل دهید. ${this.editMode() ? '' : 'با توجه به محل سکونت شما، روش‌های مختلفی برای ارسال در دسترس است. '} ابتدا محل سکونت خود را انتخاب کنید.`,
  );

  goToLocationDetails = output<SelectedAddressModel>();

  ngOnInit() {
    this.getLocationData();
    this.initLocationForm();
  }

  onBack() {
    if (this.editMode() || this.showAddressDetails()) {
      this.goToStep.emit(ChequeDeliverySteps.CHEQUE_DELIVERY_LOCATION_TIME_DETAILS);
    } else {
      this.creditChequeStepService.resetDeliveryInfo();
      this.back.emit();
    }
  }

  getLocationData() {
    this.showLoading.set(true);
    this.creditApiService.getChequeDeliveryLocations().subscribe({
      next: (response) => {
        this.provinces.set(response.items);
        this.provinceOptions.set(
          response.items.map((item) => ({
            value: item.provinceId,
            title: item.provinceName,
          })),
        );
        this.userAddresses.set(response.addresses);
        this.showLoading.set(false);
        if (this.selectedAddress()) {
          this.form.setValue(this.selectedAddress()!);
        } else {
          this.checkAddressToPreFill();
        }
      },
      error: (error) => {
        this.messageService.showErrorOfErrorResponse(error);
      },
    });
  }

  stopEnterKeyboard(input: string): boolean {
    return input !== 'Enter';
  }

  initLocationForm() {
    this.form = this.formBuilder.group({
      provinceId: [null, Validators.required],
      cityId: [null, Validators.required],
      cityName: [null],
      provinceName: [null],
      address: [null],
      addressNo: [null],
      addressUnit: [null],
      postalCode: [null],
    });

    this.setValidatorOnControls();
    this.provinceChange();
    this.cityChanged();
  }

  setValidatorOnControls() {
    if (this.showAddressDetails()) {
      this.form.controls['address'].setValidators([Validators.minLength(10), Validators.maxLength(200)]);
      this.form.controls['addressNo'].setValidators(Validators.required);
      this.form.controls['addressUnit'].setValidators(Validators.required);
      this.form.controls['postalCode'].setValidators([Validators.required, Validators.pattern(/^[1345-9][13456789]{4}\d{5}$/)]);
    } else {
      this.form.controls['address'].clearValidators();
      this.form.controls['addressNo'].clearValidators();
      this.form.controls['addressUnit'].clearValidators();
      this.form.controls['postalCode'].clearValidators();
    }

    this.form.controls['address'].updateValueAndValidity();
    this.form.controls['addressNo'].updateValueAndValidity();
    this.form.controls['addressUnit'].updateValueAndValidity();
    this.form.controls['postalCode'].updateValueAndValidity();
  }

  provinceChange() {
    this.form.controls['provinceId'].valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (selectedProvinceId) => {
        const province = this.provinces().find((province) => province.provinceId === selectedProvinceId);
        if (province) {
          this.cityOptions.set(
            province!.cities.map((item) => ({
              value: item.cityId,
              title: item.cityName,
            })),
          );
          if (!this.cityOptions().find((item) => this.form.controls['cityId'].value === item.value)) {
            this.form.controls['cityId'].reset();
          }
        }
      },
    });
  }

  cityChanged() {
    this.form.controls['cityId'].valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.checkSelectedAddressInUserAddresses();
      },
    });
  }

  checkAddressToPreFill() {
    if (this.userAddresses().length) {
      const recentUserAddress = this.userAddresses()[0];
      let addressProvince;
      for (const province of this.provinces()) {
        if (areStringsSimilar(province.provinceName, recentUserAddress.provinceName, 80)) {
          addressProvince = province;
          break;
        }
      }
      if (addressProvince) {
        for (const city of addressProvince.cities) {
          if (areStringsSimilar(city.cityName, recentUserAddress.cityName, 80)) {
            this.form.patchValue({
              cityId: city.cityId,
              provinceId: addressProvince.provinceId,
              cityName: recentUserAddress.cityName,
              provinceName: recentUserAddress.provinceName,
              address: recentUserAddress.address,
              addressNo: recentUserAddress.addressNo,
              addressUnit: recentUserAddress.addressUnit,
              postalCode: recentUserAddress.postalCode,
            });
            this.similarAddressFound.set(true);
            this.selectedCity.set(city);
            break;
          }
        }
      }
    }
  }

  checkSelectedAddressInUserAddresses() {
    const province = this.provinces().find((province) => province.provinceId === this.form.controls['provinceId'].value);
    const city = province?.cities?.find((city) => city.cityId === this.form.controls['cityId'].value);
    this.selectedCity.set(city);
    this.form.patchValue({
      cityName: province?.provinceName,
      provinceName: city?.cityName,
    });

    if (!this.userAddresses().length) {
      return;
    }

    if (!province || !city) {
      return;
    }
    const similarAddress = this.userAddresses().find(
      (userAddress) =>
        areStringsSimilar(province.provinceName, userAddress.provinceName, 80) &&
        areStringsSimilar(city.cityName, userAddress.cityName, 80),
    );
    this.similarAddressFound.set(!!similarAddress);
    this.form.patchValue({
      cityName: similarAddress?.cityName || null,
      provinceName: similarAddress?.provinceName || null,
      address: similarAddress?.address || null,
      addressNo: similarAddress?.addressNo || null,
      addressUnit: similarAddress?.addressUnit || null,
      postalCode: similarAddress?.postalCode || null,
    });
  }

  onSubmit() {
    if (this.selectedDeliveryMethod() === ChequeStepDeliveryMethod.COURIER) {
      this.creditChequeStepService.setDeliveryPickupAddress(this.form.value);
      if (this.creditChequeStepService.chequeStepDeliveryReserveInfo()?.selectedTime || this.similarAddressFound()) {
        this.goToStep.emit(ChequeDeliverySteps.CHEQUE_DELIVERY_LOCATION_TIME_DETAILS);
      } else {
        this.openTimePickerBottomSheet();
      }
      return;
    }
    this.checkLocationDeliveryMethod();
  }

  openTimePickerBottomSheet() {
    this.bottomSheetService.openBottomSheet(
      CreditChequeDeliveryDateTimePickerBottomSheetComponent,
      {
        pickupAddress: this.creditChequeStepService.chequeStepDeliveryReserveInfo()?.pickupAddress,
      },
      {
        noPadding: true,
      },
    );
    const onCloseBottomSheet = this.bottomSheetService.onClose.subscribe({
      next: () => {
        onCloseBottomSheet.unsubscribe();
        const selectedDeliveryDateTime = this.bottomSheetService.outputData();
        if (selectedDeliveryDateTime?.capacityError) {
          this.goToStep.emit(ChequeDeliverySteps.CHEQUE_DELIVERY_FULL_CAPACITY_ERROR);
          return;
        }
        if (selectedDeliveryDateTime) {
          this.creditChequeStepService.setDeliveryDateAndTime(selectedDeliveryDateTime);
          this.goToStep.emit(ChequeDeliverySteps.CHEQUE_DELIVERY_LOCATION_TIME_DETAILS);
        }
      },
    });
  }

  checkLocationDeliveryMethod() {
    const selectedCity = this.cityOptions().find((city) => city.value === this.form.controls['cityId'].value);
    if (!selectedCity) {
      return;
    }
    this.creditChequeStepService.selectedCityDeliveryMethods.set(this.selectedCity()?.deliveryMethods ?? []);
    if (this.selectedCity()?.deliveryMethods.length === 1) {
      this.creditChequeStepService.selectedChequeDeliveryMethod.set(this.selectedCity()?.deliveryMethods[0]);
      this.creditChequeStepService.selectedDeliveryCityId.set(this.selectedCity()?.cityId);
      this.goToStep.emit(ChequeDeliverySteps.CHEQUE_DELIVERY_POST_INFO);
    } else {
      this.openDeliveryMethodBottomSheet();
    }
  }

  openDeliveryMethodBottomSheet() {
    this.bottomSheetService.openBottomSheet(
      CreditChequeDeliveryMethodsBottomSheetComponent,
      {
        deliveryMethods: this.selectedCity()?.deliveryMethods,
      },
      { noPadding: true },
    );
    const onCloseBottomSheet = this.bottomSheetService.onClose.subscribe({
      next: () => {
        onCloseBottomSheet.unsubscribe();
        const selectedDeliveryMethod: ChequeStepDeliveryMethod = this.bottomSheetService.outputData();
        if (selectedDeliveryMethod) {
          this.creditChequeStepService.selectedChequeDeliveryMethod.set(selectedDeliveryMethod);
          this.goToNextStepProcess(selectedDeliveryMethod);
        }
      },
    });
  }

  goToNextStepProcess(selectedDeliveryMethod: ChequeStepDeliveryMethod) {
    if (selectedDeliveryMethod === ChequeStepDeliveryMethod.POST) {
      this.creditChequeStepService.selectedDeliveryCityId.set(this.selectedCity()?.cityId);
      this.goToStep.emit(ChequeDeliverySteps.CHEQUE_DELIVERY_POST_INFO);
      return;
    }
    if (selectedDeliveryMethod === ChequeStepDeliveryMethod.IN_PERSON) {
      this.creditChequeStepService.selectedDeliveryCityId.set(this.selectedCity()?.cityId);
      this.goToStep.emit(ChequeDeliverySteps.CHEQUE_DELIVERY_IN_PERSON_ADDRESSES);
      return;
    }
    if (selectedDeliveryMethod === ChequeStepDeliveryMethod.COURIER) {
      if (this.similarAddressFound()) {
        this.creditChequeStepService.setDeliveryPickupAddress(this.form.value);
        this.goToStep.emit(ChequeDeliverySteps.CHEQUE_DELIVERY_LOCATION_TIME_DETAILS);
      } else {
        this.setValidatorOnControls();
        this.editMode.set(true);
      }
    }
  }
}
