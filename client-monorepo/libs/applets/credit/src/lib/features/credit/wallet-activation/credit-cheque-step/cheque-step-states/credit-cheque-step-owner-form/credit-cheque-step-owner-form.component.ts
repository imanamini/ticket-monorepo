import { ChangeDetectionStrategy, Component, inject, input, OnInit, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Province } from '../../../../data-access/models/credit/province/province.model';
import { CreditApiService } from '../../../../data-access/services/credit-api.service';
import { GetChequeOwnerAddressResponse } from '../../../../data-access/models/credit/activation/get-cheque-owner-address.response';
import { CreditChequeStepService } from '../../services/credit-cheque-step.service';
import { CreditVideoPlayerDialogComponent } from '../../../../components/credit-video-player-dialog/credit-video-player-dialog.component';
import { FormFieldOption, UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { CreditPageLoadingComponent } from '../../../../components/credit-page-loading/credit-page-loading.component';
import { CreditAppBarComponent } from '../../../../components/credit-app-bar/credit-app-bar.component';
import { CreditScrollableViewComponent } from '../../../../components/credit-scrollable-view/credit-scrollable-view.component';

@Component({
  selector: 'app-credit-cheque-step-owner-form',
  templateUrl: './credit-cheque-step-owner-form.component.html',
  styleUrls: ['./credit-cheque-step-owner-form.component.scss'],
  imports: [
    ReactiveFormsModule,
    NgxButtonComponent,
    NgxTrackableIdDirective,
    CreditPageLoadingComponent,
    CreditAppBarComponent,
    CreditScrollableViewComponent,
    UiFormFieldBuilderModule,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditChequeStepOwnerFormComponent implements OnInit {
  fundProviderCode = input.required<number>();
  creditId = input.required<string>();

  nextStep = output();
  prevStep = output();
  form!: FormGroup;
  provinces!: Province[];

  loading = signal<boolean>(false);
  submitting = signal<boolean | null>(null);
  provinceOptions = signal<FormFieldOption[]>([]);
  cityOptions = signal<FormFieldOption[]>([]);

  chequeOwnerAddressResponse!: GetChequeOwnerAddressResponse;

  kycInfoList = signal<{ title: string; value: string }[]>([]);
  VALIDATION_RULES = {
    postalCode: [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/\d{10}/)],
    provinceUid: [Validators.required],
    cityUid: [Validators.required],
    address: [Validators.required, Validators.minLength(10)],
    plaqueNo: [Validators.required],
    unit: [Validators.required],
    phoneNumber: [Validators.required],
  };
  bottomSheetService = inject(NgxBottomSheetService);
  creditApiService = inject(CreditApiService);
  chequeStepService = inject(CreditChequeStepService);
  formBuilder = inject(FormBuilder);

  ngOnInit(): void {
    this.loading.set(true);
    this.setKycInfo();
    Promise.all([this.getProvinces(), this.getData()]).then(() => {
      this.createForm();
      this.loading.set(false);
    });
  }

  setKycInfo() {
    this.kycInfoList.set([]);
    if (this.chequeStepService.ownerKycData.ownerName) {
      this.kycInfoList.update((kycInfo) => [
        ...kycInfo,
        {
          title: 'نام و نام خانوادگی',
          value: this.chequeStepService.ownerKycData.ownerName,
        },
      ]);
    }
    if (this.chequeStepService.ownerKycData.ownerBirthCertificate) {
      this.kycInfoList.update((kycInfo) => [
        ...kycInfo,
        {
          title: 'شماره شناسنامه',
          value: this.chequeStepService.ownerKycData.ownerBirthCertificate,
        },
      ]);
    }
  }

  createForm() {
    const data = this.chequeOwnerAddressResponse;
    this.form = this.formBuilder.group({
      postalCode: [data.postalCode || null, this.VALIDATION_RULES.postalCode],
      provinceUid: [data.provinceUid || null, this.VALIDATION_RULES.provinceUid],
      cityUid: [data.cityUid || null, this.VALIDATION_RULES.cityUid],
      address: [data.address || null, this.VALIDATION_RULES.address],
      plaqueNo: [data.plaqueNo || null, this.VALIDATION_RULES.plaqueNo],
      unit: [data.unit || null, this.VALIDATION_RULES.unit],
      phoneNumber: [data.phoneNumber || null, this.VALIDATION_RULES.phoneNumber],
    });
    this.form.controls['provinceUid'].valueChanges.subscribe(() => {
      this.provinceChanged();
    });
  }

  goBack() {
    this.prevStep.emit();
  }

  onSubmit() {
    if (this.submitting()) {
      return;
    }
    this.submitting.set(true);
    this.creditApiService.updateChequeOwnerAddress(this.fundProviderCode(), this.creditId(), this.form.value).subscribe({
      next: () => {
        this.nextStep.emit();
        this.submitting.set(false);
      },
      error: (error) => {
        this.chequeStepService.handleError(error);
        this.submitting.set(false);
      },
    });
  }

  provinceChanged() {
    const provinceUid = this.form.controls['provinceUid'].value;
    const provinces = this.provinces.filter((p) => p.uuid === provinceUid);

    if (provinces.length > 0) {
      const province = provinces[0];
      this.cityOptions.set(
        province.cities.map((city) => {
          return {
            title: city.name,
            value: city.uuid,
          };
        }),
      );
      if (this.form.value.cityUid) {
        const currentCity = this.form.value.cityUid;
        // if currently selected city does not belong to the current province
        if (province.cities.filter((c) => c.uuid === currentCity).length === 0) {
          this.form.controls['cityUid'].setValue('', {
            emitEvent: false,
          });
        }
      }
    } else {
      this.cityOptions.set([]);
      this.form.controls['cityUid'].setValue('', {
        emitEvent: false,
      });
    }
  }

  openGuideVideoDialog() {
    this.bottomSheetService.openBottomSheet(
      CreditVideoPlayerDialogComponent,
      {
        videoUrl: 'https://www.mydigipay.com/api/website/proxy/get-file/public/2023/01/5b5a3af5-8b96-49b9-83de-4bad44290aaa.mp4',
      },
      {
        height: '50%',
      },
    );
  }

  private getData(): Promise<void> {
    return new Promise((resolve) => {
      this.creditApiService.getChequeOwnerAddress(this.fundProviderCode(), this.creditId()).subscribe({
        next: (response) => {
          this.chequeOwnerAddressResponse = response;
          resolve();
        },
        error: () => {
          this.chequeOwnerAddressResponse = {} as GetChequeOwnerAddressResponse;
          resolve();
        },
      });
    });
  }

  private getProvinces(): Promise<void> {
    return new Promise((resolve) => {
      this.creditApiService.getProvinces().subscribe((result) => {
        this.provinces = result.provinces || [];
        this.provinceOptions.set(
          this.provinces.map((province) => {
            return {
              value: province.uuid,
              title: province.name,
            };
          }),
        );
        resolve();
      });
    });
  }
}
