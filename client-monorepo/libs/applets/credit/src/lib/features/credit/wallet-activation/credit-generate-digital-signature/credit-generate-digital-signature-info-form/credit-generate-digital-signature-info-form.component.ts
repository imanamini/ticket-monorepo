import { ChangeDetectionStrategy, Component, computed, inject, Inject, OnInit, signal, TemplateRef, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreditApiService } from '../../../data-access/services/credit-api.service';
import { CreditGenerateDigitalSignatureService } from '../services/credit-generate-digital-signature.service';
import { CreditGenerateDigitalSignatureNationalCardTypeComponent } from './credit-generate-digital-signature-national-card-type/credit-generate-digital-signature-national-card-type.component';
import { NationalStatus } from '../../../data-access/models/credit/sign/national-status';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditUrlService } from '../../../data-access/utils/url';
import { DigitalSignatureStepperUrl } from '../credit-generate-digital-signature-step/general-digital-signature-steps.model';

import { CreditGenerateDigitalSignatureNationalCardComponent } from './credit-generate-digital-signature-national-card/credit-generate-digital-signature-national-card.component';
import { CreditGenerateDigitalSignatureNationalCardReceiptComponent } from './credit-generate-digital-signature-national-card-receipt/credit-generate-digital-signature-national-card-receipt.component';
import { CREDIT_ENVIRONMENT, CreditEnvironmentInterface } from '../../../credit-environment.interface';
import { NgxHybridServiceService } from '@digipay/ngx-hybrid-service';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { NgxStateService } from '@digipay/ngx-status-result';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { CreditPageLoadingComponent } from '../../../components/credit-page-loading/credit-page-loading.component';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';
import { CreditScrollableViewComponent } from '../../../components/credit-scrollable-view/credit-scrollable-view.component';
import { CreditStepperComponent } from '../../../components/credit-stepper/credit-stepper.component';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';

@Component({
  selector: 'app-credit-generate-digital-signature-info-form',
  templateUrl: './credit-generate-digital-signature-info-form.component.html',
  styleUrls: ['./credit-generate-digital-signature-info-form.component.scss'],
  imports: [
    ReactiveFormsModule,
    CreditGenerateDigitalSignatureNationalCardComponent,
    CreditGenerateDigitalSignatureNationalCardReceiptComponent,
    NgxButtonComponent,
    NgxTrackableIdDirective,
    NgxSkeletonLoadingComponent,
    CreditPageLoadingComponent,
    CreditAppBarComponent,
    CreditScrollableViewComponent,
    CreditStepperComponent,
    UiFormFieldBuilderModule,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditGenerateDigitalSignatureInfoFormComponent implements OnInit {
  creditId!: string;
  fundProviderCode!: number;
  infoTitle = 'برای ساخت امضای دیجیتال، اطلاعات زیر را تکمیل کنید.';
  infoData = signal<{ title: string; icon: string; value: string }[]>([]);
  form!: FormGroup;
  state = signal<'NATIONAL_CARD' | 'NATIONAL_CARD_RECEIPT' | null>(null);
  errorType = signal<'MI_BROWSER' | 'HUAWEI_BROWSER' | 'FIREFOX_BROWSER' | null>(null);
  browserName = computed(() => {
    if (this.errorType() === 'MI_BROWSER') {
      return 'گوشی‌های شیاومی';
    }
    if (this.errorType() === 'HUAWEI_BROWSER') {
      return 'گوشی‌های هواوی';
    }
    if (this.errorType() === 'FIREFOX_BROWSER') {
      return 'مرورگر Firefox';
    }
    return '';
  });
  controls = [
    {
      name: 'englishName',
      label: 'نام به زبان انگلیسی',
      VALIDATION_RULES: [Validators.required, Validators.pattern(/^[A-Za-z ]*$/), Validators.minLength(3), Validators.maxLength(100)],
      errorMessageMap: {
        required: 'اسم را به انگلیسی وارد نمائید.',
        minlength: 'تعداد حروف نام باید حداقل 3 حرف باشد',
        maxlength: 'تعداد حروف نام باید حداکثر 100 حرف باشد',
        pattern: 'فقط حروف انگلیسی مجاز است.',
      },
      allowedKeyDown: this.checkEnglishChar,
      maxLength: 100,
    },
    {
      name: 'englishSurname',
      label: 'نام ‌خانوادگی  به زبان انگلیسی',
      VALIDATION_RULES: [Validators.required, Validators.pattern(/^[A-Za-z ]*$/), Validators.minLength(3), Validators.maxLength(100)],
      errorMessageMap: {
        required: 'نام خانوادگی به زبان انگلیسی را وارد کنید.',
        minlength: 'تعداد حروف نام خانوادگی باید حداقل 3 حرف باشد',
        maxlength: 'تعداد حروف نام باید حداکثر 100 حرف باشد',
        pattern: 'فقط حروف انگلیسی مجاز است.',
      },
      allowedKeyDown: this.checkEnglishChar,
      maxLength: 100,
    },
  ];

  gettingData = signal<boolean | null>(null);
  submittingData = signal<boolean>(false);
  shouldAcceptTac!: boolean;
  errorIcon = viewChild<TemplateRef<any>>('errorIcon');

  bottomSheetService = inject(NgxBottomSheetService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private creditUrlService = inject(CreditUrlService);
  private creditApiService = inject(CreditApiService);
  private formBuilder = inject(FormBuilder);
  public creditGenerateDigitalSignatureService = inject(CreditGenerateDigitalSignatureService);
  private hybridService = inject(NgxHybridServiceService);
  private ngxStateService = inject(NgxStateService);

  constructor(
    @Inject(CREDIT_ENVIRONMENT)
    private creditEnvironment: CreditEnvironmentInterface,
  ) {}

  ngOnInit(): void {
    this.fundProviderCode = +this.activatedRoute.parent?.snapshot.params['fundProviderCode'];
    this.creditId = this.activatedRoute.parent?.snapshot.params['creditId'];
    this.setCurrentStep();
    this.generateInfoData();
  }

  setCurrentStep() {
    const currentStep = this.activatedRoute.snapshot.url[0].path;
    this.creditGenerateDigitalSignatureService.setCurrentStep(currentStep);
    this.creditGenerateDigitalSignatureService.setDigitalSignatureAutoNavigation(false);
  }

  createForm(
    preFillData:
      | {
          nationalCardSerial: string;
          englishName: string;
          englishSurname: string;
        }
      | any,
  ): void {
    const formConfig: any = {};
    this.controls.forEach((item) => {
      formConfig[item.name] = [preFillData[item.name], item.VALIDATION_RULES];
    });
    this.form = this.formBuilder.group({
      ...formConfig,
      nationalCardSerial: [preFillData.nationalCardSerial ?? null],
    });
  }

  generateInfoData(): void {
    this.gettingData.set(true);
    this.creditApiService.getDigitalSignatureGenerationUserInfo(this.creditId).subscribe((response) => {
      this.infoData.set([
        {
          title: 'نام و نام خانوادگی',
          value: response.fullName,
          icon: 'user',
        },
        {
          title: 'کدملی',
          value: response.nationalCode,
          icon: 'identify-card',
        },
        {
          title: 'شماره شناسنامه',
          value: response.birthCertificate,
          icon: 'numbers',
        },
        {
          title: 'کدپستی محل سکونت',
          value: response.postalCode,
          icon: 'location',
        },
      ]);
      this.createForm({
        nationalCardSerial: response.nationalCardSerial,
        englishName: response.englishName,
        englishSurname: response.englishSurname,
      });
      this.shouldAcceptTac = !response.digitalSignatureTac;
      this.gettingData.set(false);
    });
  }

  submit(): void {
    this.submittingData.set(true);
    this.checkTac()
      .then(() => {
        setTimeout(() => {
          this.checkUserPlatform();
        }, 50);
      })
      .catch(() => {
        this.submittingData.set(false);
      });
  }

  checkUserPlatform() {
    this.errorType.set(null);
    this.closeStep();
    this.gettingData.set(true);
    this.submittingData.set(false);
    if (this.hybridService.isHybrid()) {
      this.afterSubmit();
      return;
    }
    if (this.isXiaomiBrowserAvailable()) {
      this.errorType.set('MI_BROWSER');
      this.openBrowserHintBottomSheet();
    } else if (this.isHuaweiDevice()) {
      this.errorType.set('HUAWEI_BROWSER');
      this.openBrowserHintBottomSheet();
    } else if (this.isFirefoxBrowserAvailable()) {
      this.errorType.set('FIREFOX_BROWSER');
      this.openBrowserHintBottomSheet();
    } else {
      this.errorType.set(null);
      this.afterSubmit();
    }
    this.gettingData.set(false);
  }

  openBrowserHintBottomSheet() {
    this.ngxStateService.openBottomSheet(
      {
        title: `ادامه فرایند برای ${this.browserName()}`,
        description:
          'برای اطمینان از عملکرد بهینه، لطفاً از مرورگر Google Chrome برای ساخت امضای‌ دیجیتال استفاده کنید.برخی از ویژگی‌ها ممکن است در مرورگر فعلی شما به درستی کار نکنند.',
        type: 'Status',
        imgContent: this.errorIcon(),
        buttons: [
          {
            id: 'digitalSignatureBrowserNotSupportButton',
            style: 'fill',
            label: 'متوجه شدم',
            mode: 'form',
            fullWidth: true,
          },
        ],
      },
      { disableClose: true },
    );

    const onClose = this.ngxStateService.onClose().subscribe(() => {
      onClose.unsubscribe();
      const data = this.ngxStateService.outputData();
      if (data) {
        this.onContinue();
      }
    });
  }

  onContinue() {
    this.state.set(null);
    this.afterSubmit();
  }

  checkNationalCardInfo() {
    if (this.form.controls['nationalCardSerial'].value) {
      const regex = /^\d[aA-zZ]\d{8}$/;
      if (regex.test(this.form.controls['nationalCardSerial'].value)) {
        this.state.set('NATIONAL_CARD');
      } else {
        this.state.set('NATIONAL_CARD_RECEIPT');
      }
      return;
    }
    this.bottomSheetService.openBottomSheet(CreditGenerateDigitalSignatureNationalCardTypeComponent, {});

    const onCloseBottomSheet = this.bottomSheetService.onClose.subscribe(() => {
      onCloseBottomSheet.unsubscribe();
      const result: any = this.bottomSheetService.outputData();
      if (result && result.itemId === NationalStatus.HAVE_NATIONAL_CARD) {
        this.state.set('NATIONAL_CARD');
      }

      if (result && result.itemId === NationalStatus.NOT_HAVE_NATIONAL_CARD) {
        this.state.set('NATIONAL_CARD_RECEIPT');
      }
    });
  }

  afterSubmit() {
    this.submittingData.set(true);
    this.creditApiService.registerDigitalSignatureInfoForm(this.creditId, this.form.value).subscribe({
      next: () => {
        this.goNext();
      },
      error: (error) => {
        this.creditGenerateDigitalSignatureService.handleError(error);
        this.submittingData.set(false);
        this.gettingData.set(false);
      },
    });
  }

  checkTac(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.shouldAcceptTac) {
        return resolve();
      }
      this.ngxStateService.openBottomSheet({
        title: 'شرایط و ضوابط',
        description:
          'امضای دیجیتال به مدت یک سال از زمان ساخت آن اعتبار دارد. پس از امضای اسناد این پرونده، می‌توانید انتخاب کنید که امضا را حذف کنید یا با حفظ محرمانگی نزد ما نگهداری شود.',
        icon: 'info',
        type: 'Status',
        buttons: [
          {
            id: 'digitalSignatureTacConfirmButton',
            style: 'fill',
            label: 'مطالعه کردم و می‌پذیرم',
            mode: 'form',
            fullWidth: true,
          },
        ],
      });

      const onClose = this.ngxStateService.onClose().subscribe(() => {
        onClose.unsubscribe();
        const data = this.ngxStateService.outputData();
        if (data?.clicked === 'digitalSignatureTacConfirmButton') {
          return resolve();
        }
        return reject(new Error('Operation failed'));
      });
    });
  }

  isXiaomiBrowserAvailable(): boolean {
    const userAgent = navigator.userAgent.toLowerCase();
    return /xiaomi/.test(userAgent);
  }

  isHuaweiDevice(): boolean {
    const userAgent = navigator.userAgent.toLowerCase();
    return userAgent.includes('huawei') || userAgent.includes('honor');
  }

  isFirefoxBrowserAvailable(): boolean {
    return /firefox|fxios/i.test(navigator.userAgent);
  }

  backToStepper(): void {
    this.router.navigateByUrl(
      this.creditUrlService.getInnerServicePath(`${DigitalSignatureStepperUrl + this.fundProviderCode}/${this.creditId}`),
    );
  }

  goNext() {
    const currentStep = this.activatedRoute.snapshot.url[0].path;
    const nextStep = this.creditGenerateDigitalSignatureService.getNextStepURL(currentStep);
    if (!nextStep) {
      this.backToStepper();
      return;
    }
    this.router.navigateByUrl(
      this.creditUrlService.getInnerServicePath(`${DigitalSignatureStepperUrl + this.fundProviderCode}/${this.creditId}/${nextStep}`),
    );
  }

  closeStep() {
    this.state.set(null);
  }

  checkEnglishChar(input: string): boolean {
    const regex = /[a-zA-Z0-9\s]{1}/g;
    if (regex.test(input)) {
      return true;
    }
    return false;
  }

  showNationalCardReceipt() {
    this.state.set('NATIONAL_CARD_RECEIPT');
  }

  showNationalCard() {
    this.state.set('NATIONAL_CARD');
  }

  setNationalCardSerialNumber(serialNumber: string): void {
    this.form.get('nationalCardSerial')?.setValue(serialNumber);
    this.submit();
  }

  setReceiptQueryStatus(queryStatus: string): void {
    this.form.get('nationalCardSerial')?.setValue(queryStatus);
    this.submit();
  }
}
