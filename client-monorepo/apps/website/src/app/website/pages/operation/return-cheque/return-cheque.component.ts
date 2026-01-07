import { Component, computed, effect, Inject, inject, OnDestroy, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { FormFieldOption, UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { Subject, takeUntil } from 'rxjs';
import { DeliveryByCourierPreviewDialogComponent } from './components/delivery-by-courier-preview-dialog/delivery-by-courier-preview-dialog.component';
import { DeliveryByPostPreviewDialogComponent } from './components/delivery-by-post-preview-dialog/delivery-by-post-preview-dialog.component';
import { DeliveryInPersonPreviewDialogComponent } from './components/delivery-in-person-preview-dialog/delivery-in-person-preview-dialog.component';
import { DeliveryDirectionEnum } from './models/delivery-direction.enum';
import { DeliveryMethod } from './models/delivery-method.enum';
import { LogisticMethod } from './models/delivery-method.model';
import { ReserveStatus } from './models/reserve-status.enum';
import { ReturnCourierRequestModel } from './models/return-courier-request.model';
import { ReturnInpersonRequestModel } from './models/return-inperson-request.model';
import { ReturnPostRequestModel } from './models/return-post-request.model';
import { VerifyOtpResponseModel } from './models/verify-otp-response.model';
import { OtpDialogComponent } from './otp-dialog/otp-dialog.component';
import { FormStepService } from './services/form-step.service';
import { ReturnApiService } from './services/return-api.service';
import { BaseLayoutComponent } from '../../../layout/base-layout/base-layout.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { DeliveryInPersonComponent } from './components/delivery-in-person/delivery-in-person.component';
import { DeliveryByPostComponent } from './components/delivery-by-post/delivery-by-post.component';
import { NgxDividerComponent } from '@digipay/ngx-divider';
import { DeliveryByCourierComponent } from './components/delivery-by-courier/delivery-by-courier.component';
import { NgxStepperComponent } from '@digipay/ngx-stepper';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';

@Component({
  selector: 'app-return-cheque',
  styleUrl: './return-cheque.component.scss',
  templateUrl: './return-cheque.component.html',
  standalone: true,
  imports: [
    BaseLayoutComponent,
    ReactiveFormsModule,
    CommonModule,
    NgxButtonComponent,
    DeliveryInPersonComponent,
    DeliveryByPostComponent,
    UiFormFieldBuilderModule,
    NgxDividerComponent,
    DeliveryByCourierComponent,
    NgxStepperComponent,
    NgxSpinnerModule
  ]
})
export class ReturnChequeComponent implements OnInit, OnDestroy{
  deliveryMethodEnum = DeliveryMethod;
  form: FormGroup;
  loading = signal(false);
  initiated = signal(false);
  verifyOtpModel: VerifyOtpResponseModel;
  unsubscribe$ = new Subject<void>();
  provincesOption: FormFieldOption[] = [];
  citiesOption: FormFieldOption[] = [];
  methodsOption: FormFieldOption[] = [];
  formStepService = inject(FormStepService);
  currentTitle = computed(() => this.formStepService.currentStepTitle());
  currentStep = computed(() => this.formStepService.currentStep());
  deliveryMethod = computed(() => this.formStepService.deliveryMethod());
  steps = computed(() => Array.from({ length: this.formStepService.stepsCount() + 1 }, (_, i) => ({ id: i + 1 })));

  private provinces: LogisticMethod[];
  private token: string;
  private readonly STORAGE_KEY = 'return-cheque-verify-otp';
  private now = new Date().getTime();
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private api = inject(ReturnApiService);
  private route = inject(ActivatedRoute);
  private isDestroyed = false; // Add destruction flag

  constructor(@Inject(PLATFORM_ID) private platformId: string) {
    effect(() => {
      if (this.currentStep() > 0) {
        this.scrollToPosition('smooth');
      }
    });
  }

  ngOnDestroy(): void {
    this.isDestroyed = true; // Set destruction flag
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.unsubscribe$ = undefined;
  }

  ngOnInit(): void {
    // Only initialize if running in browser
    if (isPlatformBrowser(this.platformId)) {
      this.createForm();
      this.getToken();
      this.openOtpDialog();
      this.subscribeOnProvinceValueChanges();
      this.subscribeOnCityValueChanges();
    }
  }

  nextStep() {
    if (this.form.valid) {
      this.formStepService.setDeliveryMethod(this.form.get('deliveryMethod')?.value);
      this.formStepService.setCurrentStep(1);
    }
  }

  previousStep() {
    this.formStepService.previousStep();
  }

  handleFormPostSubmit(data, reserveStatus = ReserveStatus.Pending) {
    if (this.isDestroyed) return; // Check if component is destroyed

    const { cityId, logisticToken, reserveSession } = this.form.getRawValue();
    const returnPostRequestModal: ReturnPostRequestModel = {
      cityId,
      logisticToken,
      reserveSession,
      streetAddress: data.address,
      postalCode: data.postalCode,
      no: data.no,
      unit: data.unit,
    };

    this.dialog.open(DeliveryByPostPreviewDialogComponent, {
      width: '400px',
      autoFocus: false,
      panelClass: 'return-dialog-panel',
      data: {
        returnPostRequestModal,
        ...this.verifyOtpModel,
        ...data,
        reserveStatus,
      },
      disableClose: true,
    });
  }

  handleFormCourierSubmit(data, reserveStatus = ReserveStatus.Pending) {
    if (this.isDestroyed) return; // Check if component is destroyed

    const { cityId, logisticToken, reserveSession } = this.form.getRawValue();
    const returnCourierRequestModal: ReturnCourierRequestModel = {
      cityId,
      logisticToken,
      reserveSession,
      streetAddress: data.address,
      postalCode: data.postalCode,
      no: data.no,
      unit: data.unit,
      reserveDate: data.deliveryDate,
      timeSlotId: data.timeSlot.id,
    };

    this.dialog.open(DeliveryByCourierPreviewDialogComponent, {
      width: '400px',
      autoFocus: false,
      panelClass: 'return-dialog-panel',
      data: {
        ...this.verifyOtpModel,
        ...data,
        reserveStatus,
        returnCourierRequestModal,
      },
      disableClose: true,
    });
  }

  handleFormInPersonSubmit(data, reserveStatus = ReserveStatus.Pending) {
    if (this.isDestroyed) return; // Check if component is destroyed

    const { cityId, logisticToken, reserveSession } = this.form.getRawValue();
    const inPersonRequestModel: ReturnInpersonRequestModel = {
      cityId,
      logisticToken,
      reserveSession,
      deliveryProviderId: data?.deliveryProvider?.deliveryProviderId,
      reserveDate: data?.reserveDate,
      timeSlotId: data?.timeSlot.id,
    };

    this.dialog.open(DeliveryInPersonPreviewDialogComponent, {
      width: '400px',
      autoFocus: false,
      panelClass: 'return-dialog-panel',
      data: {
        ...this.verifyOtpModel,
        ...data,
        reserveStatus,
        inPersonRequestModel,
      },
      disableClose: true,
    });
  }

  private scrollToPosition(behavior: ScrollBehavior = 'instant') {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 100, behavior });
    }
  }

  private subscribeOnCityValueChanges() {
    this.form.controls.cityId.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe((cityId) => {
      if (cityId === null || this.isDestroyed) {
        return;
      }
      const provinceId = this.form.controls.province.value;
      const province = this.provinces.find((f) => f.provinceId === provinceId);
      this.methodsOption = province.cities
        .find((f) => f.cityId === cityId)
        .deliveryMethods.map((d) => ({
          title: d.displayName,
          value: d.value,
        }));
      this.form.patchValue({
        deliveryMethod: null,
      });
    });
  }

  private subscribeOnProvinceValueChanges() {
    this.form.controls.province.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe((provinceId) => {
      if (provinceId === null || this.isDestroyed) {
        return;
      }
      this.citiesOption = this.provinces
        .find((f) => f.provinceId === provinceId)
        .cities.map((d) => ({
          title: d.cityName,
          value: d.cityId,
        }));
      this.methodsOption = [];
      this.form.patchValue({
        deliveryMethod: null,
        cityId: null,
      });
    });
  }

  private getLogesticMethods() {
    if (this.isDestroyed) return;

    this.api
      .getLogesticMethods(DeliveryDirectionEnum.Return)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          if (this.isDestroyed) return;
          this.provinces = res.items;
          this.provincesOption = res.items.map((p) => ({ title: p.provinceName, value: p.provinceId }));
        },
      });
  }

  private createForm() {
    this.form = this.fb.group({
      province: [null, Validators.required],
      cityId: [null, Validators.required],
      deliveryMethod: [null, Validators.required],
      reserveSession: [null, Validators.required],
      logisticToken: [null, Validators.required],
    });
  }

  private openOtpDialog() {
    if (this.isDestroyed || !isPlatformBrowser(this.platformId)) return;

    const cached = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || 'null');
    this.initiated.set(true);
    if (cached) {
      if (this.now < cached.expiry) {
        this.onVerifyOtpSuccess(JSON.parse(cached.data));
        this.getLogesticMethods();
        return;
      } else {
        localStorage.removeItem(this.STORAGE_KEY);
      }
    }
    const otpDialog = this.dialog.open(OtpDialogComponent, {
      width: '450px',
      minHeight: '360px',
      panelClass: 'return-dialog-panel',
      data: {
        token: this.token,
      },
      disableClose: true,
    });


    otpDialog
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        if (this.isDestroyed) return;
        this.saveReceivedData(res);
        this.onVerifyOtpSuccess(res?.verify);
        this.getLogesticMethods();
      });
  }

  private onVerifyOtpSuccess(verify: VerifyOtpResponseModel) {
    if (this.isDestroyed) return;

    this.verifyOtpModel = verify;

    this.form.patchValue({
      reserveSession: verify?.reserveSession,
    });

    const reserveStatus = verify?.reserve?.reserveStatus?.value;
    if (reserveStatus !== ReserveStatus.Pending) {
      // Add small delay to ensure component is stable
      setTimeout(() => {
        if (this.isDestroyed) return;

        if (verify?.reserve?.method?.value === DeliveryMethod.DeliveryByPost) {
          this.handleFormPostSubmit(this.verifyOtpModel?.reserve, reserveStatus);
        } else if (verify?.reserve?.method.value === DeliveryMethod.DeliveryByCourier) {
          this.handleFormCourierSubmit(this.verifyOtpModel?.reserve, reserveStatus);
        } else {
          this.handleFormInPersonSubmit(this.verifyOtpModel?.reserve, reserveStatus);
        }
      });
    }
  }

  private getToken() {
    this.token = this.route.snapshot.queryParams.token;
    this.form.patchValue({
      logisticToken: this.token,
    });
  }

  private saveReceivedData(res: any) {
    if (!isPlatformBrowser(this.platformId) || this.isDestroyed) return;

    const cacheDurationMs = 9 * 60 * 1000; // 9 minutes
    const cacheData = {
      data: JSON.stringify(res?.verify),
      expiry: this.now + cacheDurationMs,
    };
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cacheData));
  }
}
