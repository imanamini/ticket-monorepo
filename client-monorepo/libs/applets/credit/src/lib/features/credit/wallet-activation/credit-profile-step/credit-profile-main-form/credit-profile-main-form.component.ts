import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CreditApiService } from '../../../data-access/services/credit-api.service';
import { Province } from '../../../data-access/models/credit/province/province.model';
import { CreditProfileStatusBaseComponent } from '../credit-profile-status-base/credit-profile-status-base.component';
import {
  CREDIT_PROFILE_RULE,
  ProfileStepField,
  ProfileStepFieldName,
} from '../../../data-access/models/credit/profile/credit-profile-step.response';
import { MessageService } from '../../../data-access/services/message.service';
import { FormFieldOption, UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { UserAddress } from '../../../data-access/models/credit/profile/credit-profile-response.model';
import { CreditProfileAddressesBottomSheetComponent } from '../credit-profile-addresses-bottom-sheet/credit-profile-addresses-bottom-sheet.component';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { CreditPageLoadingComponent } from '../../../components/credit-page-loading/credit-page-loading.component';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { CreditProfileHeaderMessageComponent } from '../credit-profile-header-message/credit-profile-header-message.component';
import { CreditScrollableViewComponent } from '../../../components/credit-scrollable-view/credit-scrollable-view.component';

@Component({
  selector: 'app-credit-profile-main-form',
  templateUrl: './credit-profile-main-form.component.html',
  styleUrls: ['./credit-profile-main-form.component.scss'],
  standalone: true,
  imports: [
    CreditScrollableViewComponent,
    FormsModule,
    ReactiveFormsModule,
    UiFormFieldBuilderModule,
    CreditProfileHeaderMessageComponent,
    NgxButtonComponent,
    CreditPageLoadingComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditProfileMainFormComponent extends CreditProfileStatusBaseComponent implements OnInit {
  showBirthPlace = signal<boolean>(false);
  loading = signal<boolean | null>(null);
  form!: FormGroup;
  ctaLoading = signal<boolean>(false);
  profileFields = signal<{
    [key: string]: ProfileStepField;
  }>({});
  provinceOptions = signal<FormFieldOption[]>([]);
  birthProvinceOptions = signal<FormFieldOption[]>([]);
  cityOptions = signal<FormFieldOption[]>([]);
  birthCityOptions = signal<FormFieldOption[]>([]);
  provinces = signal<Province[] | null>(null);
  showEducationAndJob = signal<boolean>(false);
  educationOptions = signal<{ title: string; value: string }[]>([]);
  jobOptions = signal<{ title: string; value: string }[]>([]);
  showError = signal<'auto' | 'show'>('auto');
  headerMessage = signal<{
    content: string;
    color: string;
    bgColor: string;
    strokeColor: string;
  } | null>(null);
  VALIDATION_RULES = signal<{
    [key: string]: ValidatorFn[];
  }>({
    birthPlaceProvince: [this.externalErrorValidator('birthPlaceProvince').bind(this)],
    birthPlace: [this.externalErrorValidator('birthPlace').bind(this)],
    postalCode: [this.externalErrorValidator('postalCode').bind(this), Validators.pattern(/^[1345-9][13456789]{4}\d{5}$/)],
    provinceUid: [this.externalErrorValidator('provinceUid').bind(this)],
    cityUid: [this.externalErrorValidator('cityUid').bind(this)],
    address: [this.externalErrorValidator('address').bind(this), Validators.minLength(10), Validators.maxLength(200)],
    addressNo: [this.externalErrorValidator('addressNo').bind(this)],
    addressUnit: [this.externalErrorValidator('addressUnit').bind(this)],
    phoneNumber: [this.externalErrorValidator('phoneNumber').bind(this), Validators.pattern(/^(?!.*(\d)\1{5})0[1-8]{1}[0-9]{9}$/)],
    job: [this.externalErrorValidator('job').bind(this)],
    education: [this.externalErrorValidator('education').bind(this)],
  });
  parentErrors = signal<{ [key: string]: string }>({});
  fields = signal<ProfileStepFieldName[]>([
    'postalCode',
    'provinceUid',
    'cityUid',
    'address',
    'addressNo',
    'addressUnit',
    'phoneNumber',
    'birthPlace',
    'birthPlaceProvince',
    'education',
    'job',
  ]);
  formBuilder = inject(FormBuilder);
  creditApiService = inject(CreditApiService);
  messageService = inject(MessageService);
  bottomSheet = inject(NgxBottomSheetService);
  protected readonly CREDIT_PROFILE_RULE = CREDIT_PROFILE_RULE;

  ngOnInit(): void {
    this.setServerErrors();
    this.getData();
  }

  setServerErrors(): void {
    if (this.profileStatusData()?.fieldErrors) {
      this.profileStatusData()?.fieldErrors?.forEach((fieldError) => {
        if (this.fields().includes(fieldError.fieldName as ProfileStepFieldName)) {
          this.parentErrors.update((errors) => ({
            ...errors,
            [fieldError.fieldName]: fieldError.text,
          }));
        }
      });
    }
  }

  createForm(selectedRecentAddress?: UserAddress): void {
    const formData: any = {};
    this.fields().forEach((fieldName) => {
      const field: ProfileStepField = this.profileFields()[fieldName]
        ? this.profileFields()[fieldName]
        : {
            name: fieldName,
            value: null,
            editable: true,
            option: CREDIT_PROFILE_RULE.OPTIONAL,
          };
      if (selectedRecentAddress) {
        field.value = field.option === CREDIT_PROFILE_RULE.MANDATORY ? selectedRecentAddress[fieldName] : null;
        if (this.parentErrors()[fieldName]) {
          delete this.parentErrors()[fieldName];
        }
      }
      this.profileFields.update((profileField) => ({
        ...profileField,
        [fieldName]: field,
      }));
      this.VALIDATION_RULES.update((rules) => ({
        ...rules,
        [fieldName]: field.option === CREDIT_PROFILE_RULE.MANDATORY ? [Validators.required].concat(this.VALIDATION_RULES()[fieldName]) : [],
      }));
      formData[fieldName] = [field.value, this.VALIDATION_RULES()[fieldName]];
    });
    this.form = this.formBuilder.group(formData);
    if (this.profileStatusData()?.fieldErrors && this.profileStatusData()?.fieldErrors?.length) {
      this.scrollToInvalidField();
    }
    this.fields().forEach((f) => {
      this.form.controls[f].valueChanges.subscribe(() => {
        if (this.parentErrors()[f]) {
          delete this.parentErrors()[f];
        }
      });
    });
    this.form.controls['provinceUid'].valueChanges.subscribe(() => {
      this.provinceChanged();
    });
    this.form.controls['birthPlaceProvince'].valueChanges.subscribe(() => {
      this.birthProvinceChanged();
    });
  }

  fillFormFields(userAddress: UserAddress): void {
    this.createForm(userAddress);
    this.provinceChanged();
    this.birthProvinceChanged();
  }

  submitForm(): void {
    this.showError.set('auto');
    if (this.form.invalid) {
      this.scrollToInvalidField();
      return;
    }

    this.ctaLoading.set(true);

    const data = this.form.value;

    this.creditApiService
      .updateCreditProfile(
        {
          postalCode: data.postalCode ? data.postalCode : null,
          cityUid: data.cityUid ? data.cityUid : null,
          provinceUid: data.provinceUid ? data.provinceUid : null,
          address: data.address
            ? data.address
                .replace(/[\u200C\u00A0\r\n]+/g, ' ')
                .replace(/\s+/g, ' ')
                .trim()
            : null,
          addressNo: data.addressNo ? data.addressNo : null,
          addressUnit: data.addressUnit ? data.addressUnit : null,
          phoneNumber: data.phoneNumber ? data.phoneNumber : null,
          birthPlace: data.birthPlace ? data.birthPlace : null,
          educationUid: data.education ? data.education : null,
          jobUid: data.job ? data.job : null,
        },
        this.fundProviderCode(),
        this.creditId(),
      )
      .subscribe({
        next: () => {
          this.ctaLoading.set(false);
          this.reloadStatus.emit();
        },
        error: (e) => {
          this.ctaLoading.set(false);
          if (e && e.fieldErrors && e.fieldErrors.length) {
            e.fieldErrors.forEach((fieldError: any) => {
              this.parentErrors.update((errors) => ({
                ...errors,
                [fieldError.fieldName]: fieldError.text,
              }));
            });
          }
          this.messageService.showErrorOfErrorResponse(e);
        },
      });
  }

  scrollToInvalidField() {
    this.showError.set('show');
    setTimeout(() => {
      const form = document.getElementById('info-form');
      const invalidControls = form?.getElementsByClassName('ng-invalid');
      if (invalidControls && invalidControls.length) {
        invalidControls[0].scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  externalErrorValidator(controlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return this.parentErrors()[controlName] ? { serverError: true } : null;
    };
  }

  provinceChanged(): void {
    if (!this.provinces()) {
      return;
    }
    const provinceUid = this.form.controls['provinceUid'].value;
    const province = this.provinces()?.find((p) => p.uuid === provinceUid);

    if (province) {
      this.cityOptions.set(
        this.sortListByName(province.cities).map((city) => {
          return {
            title: city.name,
            value: city.uuid,
            order: province.order,
          };
        }),
      );
      const useFullCities = this.filterAndSortByOrder(province.cities);
      if (useFullCities && useFullCities.length > 0) {
        this.cityOptions.update((items) => [
          {
            title: '____________________',
            value: 'divider',
            disabled: true,
          },
          ...items,
        ]);
        useFullCities.forEach((item) => {
          this.cityOptions.update((items) => [{ title: item.name, value: item.uuid }, ...items]);
        });
      }
      const currentCity = this.form.value.cityUid;
      // if currently selected city does not belong to the current province
      if (!currentCity || province.cities.filter((c) => c.uuid === currentCity).length === 0) {
        this.form.controls['cityUid'].setValue('', {
          emitEvent: false,
        });
      }
    } else {
      this.cityOptions.set([]);
      this.form.controls['cityUid'].setValue('', {
        emitEvent: false,
      });
    }
  }

  birthProvinceChanged(): void {
    if (!this.provinces()) {
      return;
    }
    const provinceUid = this.form.controls['birthPlaceProvince'].value;
    const province = this.provinces()?.find((p) => p.uuid === provinceUid);

    if (province) {
      this.birthCityOptions.set(
        this.sortListByName(province.cities).map((city) => {
          return {
            title: city.name,
            value: city.uuid,
            order: province.order,
          };
        }),
      );
      const currentCity = this.form.value.birthPlace;
      // if currently selected city does not belong to the current province
      if (!currentCity || province.cities.filter((c) => c.uuid === currentCity).length === 0) {
        this.form.controls['birthPlace'].setValue('', {
          emitEvent: false,
        });
      }
    } else {
      this.birthCityOptions.set([]);
      this.form.controls['birthPlace'].setValue('', {
        emitEvent: false,
      });
    }
  }

  sortListByName(input: any[]): any[] {
    return input.sort((a, b) => a.name.localeCompare(b.name));
  }

  stopEnterKeyboard(input: string): boolean {
    return input !== 'Enter';
  }

  filterAndSortByOrder(
    items: {
      name: string;
      uuid: string;
      order?: number;
    }[],
  ) {
    const filteredArray = items.filter((item) => item.order !== undefined);
    filteredArray.sort((a, b) => a.order! - b.order!);
    return filteredArray;
  }

  getUserAddresses() {
    this.creditApiService.getUserAddresses().subscribe({
      next: (response) => {
        if (response.addresses.length && !Object.keys(this.parentErrors()).length) {
          this.loading.set(true);
          this.openRecentAddressesBottomSheet(response.addresses);
        } else {
          this.loading.set(false);
        }
      },
      error: (error) => {
        this.messageService.showErrorOfErrorResponse(error);
      },
    });
  }

  openRecentAddressesBottomSheet(addresses: UserAddress[]) {
    this.bottomSheet.openBottomSheet(
      CreditProfileAddressesBottomSheetComponent,
      {
        disableClose: true,
        data: addresses,
      },
      { noPadding: true, disableClose: true },
    );

    const onCloseBottomSheet = this.bottomSheet.onClose.subscribe(() => {
      onCloseBottomSheet.unsubscribe();
      const selectedAddress = this.bottomSheet.outputData();
      if (selectedAddress) {
        this.fillFormFields(selectedAddress);
      } else {
        this.form.reset();
      }
      this.loading.set(false);
    });
  }

  private getData() {
    this.loading.set(true);
    this.creditApiService.getCreditProfileStepData(this.creditId()).subscribe((response) => {
      this.profileFields.set({});
      this.headerMessage.set(response.header);
      response.fields.forEach((f) => {
        const fieldName = f.name;
        this.profileFields.update((profileField) => ({
          ...profileField,
          [fieldName]: f,
        }));
        if (fieldName === 'birthPlace') {
          this.showBirthPlace.set(true);
        }
        if (fieldName === 'education' || fieldName === 'job') {
          this.showEducationAndJob.set(true);
        }
      });
      this.createForm();
      this.loading.set(false);
      this.getProvinces();
      if (this.showEducationAndJob()) {
        this.getEducations();
        this.getJobs();
      }
      this.getUserAddresses();
    });
  }

  private getProvinces() {
    this.creditApiService.getProvinces().subscribe((result) => {
      this.provinces.set(result.provinces);
      this.provinceOptions.set(
        this.sortListByName(this.provinces()!).map((province) => {
          return {
            value: province.uuid,
            title: province.name,
            order: province?.order,
          };
        }),
      );
      this.birthProvinceOptions.set(
        this.sortListByName(this.provinces()!).map((province) => {
          return {
            value: province.uuid,
            title: province.name,
            order: province?.order,
          };
        }),
      );
      const useFullProvinces = this.filterAndSortByOrder(this.provinces()!);
      if (useFullProvinces && useFullProvinces.length > 0) {
        this.provinceOptions.update((items) => [
          {
            title: '____________________',
            value: 'divider',
            disabled: true,
          },
          ...items,
        ]);
        useFullProvinces.reverse().forEach((item) => {
          this.provinceOptions.update((items) => [{ title: item.name, value: item.uuid }, ...items]);
        });
      }
      if (this.form.value.provinceUid) {
        this.provinceChanged();
      }
      if (this.form.value.birthPlaceProvince) {
        this.birthProvinceChanged();
      }
    });
  }

  private getEducations() {
    this.creditApiService.getEducations().subscribe({
      next: (response) => {
        this.educationOptions.set(
          response.educations.map((education) => {
            return {
              title: education.title,
              value: education.uid,
            };
          }),
        );
      },
    });
  }

  private getJobs() {
    this.creditApiService.getJobs(this.creditId()!).subscribe({
      next: (response) => {
        this.jobOptions.set(
          response.jobs.map((job) => {
            return {
              title: job.title,
              value: job.uid,
            };
          }),
        );
      },
    });
  }
}
