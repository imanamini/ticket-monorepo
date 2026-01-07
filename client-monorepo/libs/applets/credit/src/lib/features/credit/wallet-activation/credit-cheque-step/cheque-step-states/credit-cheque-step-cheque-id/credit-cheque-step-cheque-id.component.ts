import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, OnDestroy, OnInit, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreditApiService } from '../../../../data-access/services/credit-api.service';
import { translateOrder } from '../../../../data-access/utils/strings';
import { CreditChequeStepService } from '../../services/credit-cheque-step.service';
import { FormFieldOption, UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { formatIban } from '@digipay/strings';
import { hasWebCam, isMobileOrTablet } from '../../../../data-access/utils/device';
import { CREDIT_ENVIRONMENT, CreditEnvironmentInterface } from '../../../../credit-environment.interface';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { BarcodeScannerService } from '../../../../components/credit-qr-scanner/barcode-scanner.service';
import { Subscription } from 'rxjs';
import { CreditChequeStepChequeIdModel } from './credit-cheque-step-cheque-id-form.model';
import { NgxCheckboxComponent } from '@digipay/ngx-checkbox';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { CreditChequeQrScannerComponent } from '../credit-cheque-step-form/credit-cheque-qr-scanner/credit-cheque-qr-scanner.component';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { CreditAppBarComponent } from '../../../../components/credit-app-bar/credit-app-bar.component';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AnimationLoader, AnimationOptions, LottieComponent, provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web/build/player/lottie_light';
import { AnimationConst } from './animation-const';
import { CreditStepperComponent } from '../../../../components/credit-stepper/credit-stepper.component';

const INSTALLMENT_ALERT_MESSAGE =
  'قبل از نوشتن چک اطلاعات آن را وارد کنید تا بررسی‌های لازم انجام شود،سپس از روی راهنمایی که در ادامه نمایش داده می‌شود چک را بنویسید.';
const installmentVideoUrl = 'https://www.mydigipay.com/api/website/proxy/get-file/public/2024/01/81e4031f-4e13-4a14-87c3-c246dfa36833.MP4';
const chequeVideoUrl = 'https://www.mydigipay.com/api/website/proxy/get-file/public/2024/12/witing-cheque.mp4';

@Component({
  selector: 'app-credit-cheque-step-cheque-id',
  templateUrl: './credit-cheque-step-cheque-id.component.html',
  styleUrls: ['./credit-cheque-step-cheque-id.component.scss'],
  imports: [
    ReactiveFormsModule,
    NgxCheckboxComponent,
    NgxButtonComponent,
    NgxTrackableIdDirective,
    CreditAppBarComponent,
    UiFormFieldBuilderModule,
    NgxDividerComponent,
    LottieComponent,
    CreditStepperComponent,
  ],
  standalone: true,
  providers: [
    AnimationLoader,
    provideLottieOptions({
      player: () => player,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditChequeStepChequeIdComponent implements OnInit, OnDestroy {
  scanSubscription!: Subscription;
  showLoading = signal<boolean>(false);
  showScanner = signal<boolean | null>(null);
  checkOwner = signal(false);
  alertMessage = signal<string | null>(null);
  relationOptions = signal<FormFieldOption[]>([]);
  translateOrder = translateOrder;
  form!: FormGroup;
  VALIDATION_RULES = {
    chequeId: [Validators.required, Validators.pattern(/^\d{16}$/)],
    ownerRelative: [Validators.required],
  };
  options: AnimationOptions = {
    animationData: AnimationConst,
  };

  isInstallment = input<boolean>(true);
  creditId = input.required<string>();
  chequeOrder = input<number>();
  chequeId = input<string>();
  videoUrl = computed(() => (this.isInstallment() ? installmentVideoUrl : chequeVideoUrl));
  nextStep = output();
  prevStep = output();
  outputFormData = output<CreditChequeStepChequeIdModel>();

  bottomSheetService = inject(NgxBottomSheetService);
  scannerService = inject(BarcodeScannerService);
  private formBuilder = inject(FormBuilder);
  private apiService = inject(CreditApiService);
  private creditChequeStepService = inject(CreditChequeStepService);
  private creditEnvironment = inject<CreditEnvironmentInterface>(CREDIT_ENVIRONMENT);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.checkCam();
    this.fillRelationList();
    this.makeForm();
    this.alertMessage.set(this.isInstallment() ? INSTALLMENT_ALERT_MESSAGE : this.creditChequeStepService.selectedStepFlow.description!);
  }

  ngOnDestroy(): void {
    if (this.scanSubscription) {
      this.scanSubscription.unsubscribe();
    }
    this.scannerService.data.next(null);
  }

  checkCam(): void {
    if (isMobileOrTablet()) {
      hasWebCam()
        .then(() => {
          this.showScanner.set(true);
        })
        .catch(() => {
          this.showScanner.set(false);
        });
    }
  }

  scanBarcode(): void {
    if (this.showScanner()) {
      this.bottomSheetService.openBottomSheet(CreditChequeQrScannerComponent, {});
    }

    this.scannerService.scan({
      title: 'اسکن بارکد',
    });

    // listen for scan event
    this.scanSubscription = this.scannerService.onScan.asObservable().subscribe((result) => {
      const resultArr = result.scannedValue.split('\n');
      const ibanNumberRegex = new RegExp(/^IR\d{24}$/i);
      const ibanNumberChequeNumberRegex = new RegExp(/^IR\d{40}$/i);
      const chequeNumberRegex = new RegExp(/^\d{16}$/i);
      const newData: any = {};
      resultArr.map((item) => {
        const cleanItem = item.replace(/\s/gi, '').trim();
        if (ibanNumberRegex.test(cleanItem)) {
          newData.ibanNumber = formatIban(cleanItem);
        }
        if (chequeNumberRegex.test(cleanItem)) {
          newData.chequeNumber = cleanItem;
        }
        if (ibanNumberChequeNumberRegex.test(cleanItem)) {
          newData.ibanNumber = formatIban(cleanItem.substring(0, 26)); // "IR123456789012345678901234"
          newData.chequeNumber = cleanItem.substring(26, 42); // "5678901234567890"
        }
      });
      this.form.controls['chequeId'].setValue(newData.chequeNumber);
      this.form.controls['chequeId'].updateValueAndValidity();
    });

    this.scannerService.data
      .asObservable()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          if (!result) {
            this.bottomSheetService.closeBottomSheet();
          }
        },
      });
  }

  fillRelationList(): void {
    this.creditChequeStepService.relationList.subscribe((relationList: any) => {
      this.relationOptions.set(
        Object.keys(relationList).map((index) => {
          return {
            value: '' + index,
            title: relationList[index],
          };
        }),
      );
    });
  }

  makeForm() {
    this.form = this.formBuilder.group({
      chequeId: [this.chequeId(), this.VALIDATION_RULES.chequeId],
      ownerRelative: [null, this.VALIDATION_RULES.ownerRelative],
    });
  }

  changeOwnerState(checked: any) {
    this.form.controls['ownerRelative'].setValue(checked ? (this.isInstallment() ? 0 : this.relationOptions()[0].value) : null);
    this.form.updateValueAndValidity();
  }

  onSubmit() {
    if (!this.isInstallment()) {
      this.outputFormData.emit(this.form.value);
      return;
    }
    this.showLoading.set(true);
    this.apiService.installmentSellsGenerate(this.creditId(), this.form.value.chequeId, this.chequeOrder()!).subscribe({
      next: () => {
        this.showLoading.set(false);
        this.nextStep.emit();
      },
      error: (error) => {
        this.showLoading.set(false);
        this.creditChequeStepService.handleError(error);
      },
    });
  }

  protected readonly BorderColorsEnum = BorderColorsEnum;
}
