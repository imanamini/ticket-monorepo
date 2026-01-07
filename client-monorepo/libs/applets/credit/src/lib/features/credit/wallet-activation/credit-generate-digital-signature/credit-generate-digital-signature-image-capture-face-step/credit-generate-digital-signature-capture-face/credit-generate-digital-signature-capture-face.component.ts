import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  inject,
  input,
  model,
  OnDestroy,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { CreditGenerateDigitalSignatureMediaErrorComponent } from '../credit-generate-digital-signature-media-error/credit-generate-digital-signature-media-error.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditUrlService } from '../../../../data-access/utils/url';
import { CreditGenerateDigitalSignatureService } from '../../services/credit-generate-digital-signature.service';
import { CreditApiService } from '../../../../data-access/services/credit-api.service';
import {
  DigitalSignatureStepperUrl,
  RESPONSE_ERROR_STATUS,
  RESPONSE_ERROR_TYPE,
} from '../../credit-generate-digital-signature-step/general-digital-signature-steps.model';
import { CreditGenerateDigitalSignatureInfoBottomSheetComponent } from '../../credit-generate-digital-signature-info-form/credit-generate-digital-signature-info-bottom-sheet/credit-generate-digital-signature-info-bottom-sheet.component';
import { AndroidLifecycle, NgxHybridServiceService } from '@digipay/ngx-hybrid-service';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { CreditGenerateDigitalSignatureMediaCheckComponent } from '../credit-generate-digital-signature-media-check/credit-generate-digital-signature-media-check.component';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { NgxTooltipDirective } from '@digipay/ngx-tooltip';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxStateService } from '@digipay/ngx-status-result';
import { translateNumberToPersianString } from '../../../../data-access/utils/strings';
import { CreditPageLoadingComponent } from '../../../../components/credit-page-loading/credit-page-loading.component';
import { CreditAppBarComponent } from '../../../../components/credit-app-bar/credit-app-bar.component';
import { CreditStepperComponent } from '../../../../components/credit-stepper/credit-stepper.component';
import { CreditScrollableViewComponent } from '../../../../components/credit-scrollable-view/credit-scrollable-view.component';
import { NgxFaceDetectionComponent } from '@digipay/ngx-face-detection';
import * as Sentry from '@sentry/angular-ivy';

@Component({
  selector: 'app-credit-generate-digital-signature-capture-face',
  standalone: true,
  imports: [
    CreditGenerateDigitalSignatureMediaErrorComponent,
    CreditGenerateDigitalSignatureMediaCheckComponent,
    NgxTrackableIdDirective,
    NgxTooltipDirective,
    NgxButtonComponent,
    CreditPageLoadingComponent,
    CreditAppBarComponent,
    CreditStepperComponent,
    CreditScrollableViewComponent,
    NgxFaceDetectionComponent,
  ],
  templateUrl: './credit-generate-digital-signature-capture-face.component.html',
  styleUrl: './credit-generate-digital-signature-capture-face.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditGenerateDigitalSignatureCaptureFaceComponent implements OnInit, OnDestroy {
  back = output();
  creditId = input.required<string>();
  fundProviderCode = input.required<number>();
  type = input.required<'PHOTO' | 'VIDEO'>();
  inputTimer = input<number>(10);
  textToRead = signal('');
  timer = signal<number>(this.inputTimer());
  preCapture = signal<boolean>(true);
  disableStopRecordingButton = signal<boolean>(true);
  captureState = signal<'READY_FOR_CAPTURE_VIDEO' | 'START_CAPTURE_VIDEO' | 'STOP_CAPTURE_VIDEO'>('READY_FOR_CAPTURE_VIDEO');
  error = signal<RESPONSE_ERROR_TYPE | null>(null);
  uploadingData = signal(false);
  loadingMedia = signal(false);
  counterTimer!: any;
  preCaptureTimer!: any;
  capturedFile = signal<string | null>(null);
  maxUploadSize = 20;

  btnDisable = model<boolean>(false);
  captureStatus = signal<'START' | 'STOP' | 'STOP_INIT'>('STOP');

  title = computed(() => {
    if (this.type() === 'PHOTO') {
      return 'شرایط لازم برای ثبت عکس:';
    }
    if (this.type() === 'VIDEO') {
      return 'شرایط لازم جهت ضبط ویدئو:';
    }
    return [];
  });
  description = computed(() => {
    if (this.type() === 'PHOTO') {
      return [
        'عکس تا جای ممکن بدون لرزش دست گرفته شود.',
        'نور مکان در دو طرف صورت مناسب و یکسان باشد.',
        'فقط فرد متقاضی در عکس حضور داشته باشد.',
        'عکس بدون ماسک ثبت شود.',
      ];
    }
    if (this.type() === 'VIDEO') {
      return [
        'ویدئو تا جای ممکن بدون لرزش دست گرفته شود.',
        'نور مکان در دو طرف صورت مناسب و یکسان باشد.',
        'فقط فرد متقاضی در ویدیو حضور داشته باشد.',
        'ویدئو بدون ماسک ثبت شود.',
        'ویدئو در محیطی آرام و بدون سروصدا ضبط شود.',
        'صورت وسط کادر مشخص شده قرار گرفته شود.',
        'جمله با صدای بلند خوانده شود.',
      ];
    }
    return []; // Default return for any other type
  });
  public creditGenerateDigitalSignatureService = inject(CreditGenerateDigitalSignatureService);
  protected readonly RESPONSE_ERROR_TYPE = RESPONSE_ERROR_TYPE;
  private bottomSheetService = inject(NgxBottomSheetService);
  private router = inject(Router);
  private creditUrlService = inject(CreditUrlService);
  private creditApiService = inject(CreditApiService);
  private activatedRoute = inject(ActivatedRoute);
  private hybridService = inject(NgxHybridServiceService);
  private ngxStateService = inject(NgxStateService);

  @HostListener('window:pagehide', ['$event'])
  onPageHide(event: Event): void {
    this.loadingMedia.set(true);
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeunload(event: Event): void {
    this.loadingMedia.set(true);
  }

  @HostListener('window:load', ['$event'])
  onLoad(event: Event): void {
    this.loadingMedia.set(false);
  }

  ngOnInit() {
    this.openGuide();
    if (this.hybridService.isHybrid()) {
      this.checkLifeCycle();
    }
  }

  checkLifeCycle(): void {
    this.hybridService.getLifeCycleStatus().subscribe({
      next: (status) => {
        this.loadingMedia.set(status === AndroidLifecycle.ON_PAUSE);
      },
      error: (error) => {
        console.warn('[CreditDigitalSignatureCapture] Error checking lifecycle:', error);
      },
    });
  }

  getAdmittanceText() {
    if (this.type() === 'VIDEO') {
      this.creditApiService.getDigitalSignatureVideoAdmittanceText(this.creditId()).subscribe({
        next: (response) => {
          this.textToRead.set(response.admittanceText);
        },
        error: (error) => {
          // Guard against undefined/null errors
          if (!error) {
            console.warn('[CreditDigitalSignatureCapture] Received undefined error');
            this.creditGenerateDigitalSignatureService.handleError({ result: null });
            return;
          }

          if (error.result) {
            if (error.result.status === RESPONSE_ERROR_STATUS.NATIVE_LIVENESS_MAX_TRY) {
              this.loadingMedia.set(true);
              this.goToTokenExpiration();
              return;
            }
          }
          this.creditGenerateDigitalSignatureService.handleError(error);
        },
      });
    }
  }

  openGuide() {
    this.bottomSheetService.openBottomSheet(
      CreditGenerateDigitalSignatureInfoBottomSheetComponent,
      {
        title: this.title(),
        descriptions: this.description(),
      },
      {
        disableClose: true,
        noPadding: true,
      },
    );
    const onClose = this.bottomSheetService.onClose.subscribe({
      next: () => {
        onClose.unsubscribe();
        this.setCurrentStep();
        this.getAdmittanceText();
      },
      error: (error) => {
        console.warn('[CreditDigitalSignatureCapture] Error in bottom sheet close:', error);
        onClose.unsubscribe();
      },
    });
  }

  setCurrentStep() {
    const currentStep = this.activatedRoute.snapshot.url[0].path;
    this.creditGenerateDigitalSignatureService.setCurrentStep(currentStep);
  }

  statusChange(event: boolean) {
    this.btnDisable.set(!event);
  }

  startingVideo() {
    this.captureStatus.set('START');
  }

  onBackClick() {
    this.loadingMedia.set(true);
    this.back.emit();
  }

  doCapture() {
    if (this.btnDisable()) {
      return;
    }
    this.startingVideo();
    this.preCapture.set(false);

    if (this.type() === 'VIDEO') {
      this.timer.set(this.inputTimer());
      this.preCaptureTimer = setTimeout(() => {
        this.startCaptureVideoFunc();
        clearTimeout(this.preCaptureTimer);
      }, 3000);
    }
  }

  onSaveCapturedFile(dataUrl: string) {
    this.capturedFile.set(dataUrl);
  }

  startCaptureVideoFunc() {
    this.captureState.set('START_CAPTURE_VIDEO');
    this.counterTimer = setInterval(() => {
      this.timer.update((prev) => prev - 1);
      if (this.timer() === this.inputTimer() - 5) {
        this.disableStopRecordingButton.set(false);
      }

      if (this.timer() < 0) {
        clearInterval(this.counterTimer);
        this.disableStopRecordingButton.set(true);
        this.captureState.set('STOP_CAPTURE_VIDEO');
      }
    }, 1000);
  }

  stopCaptureVideoFunc() {
    if (this.disableStopRecordingButton()) {
      return;
    }
    this.captureStatus.set('STOP_INIT');
    clearInterval(this.counterTimer);
    this.disableStopRecordingButton.set(true);
    this.captureState.set('STOP_CAPTURE_VIDEO');
  }

  reCapture(manuallyRecaptured = false) {
    if (this.type() === 'PHOTO' || !manuallyRecaptured) {
      this.resetCapturing();
      return;
    }
    this.ngxStateService.openBottomSheet(
      {
        title: 'آیا از ضبط دوباره ویدئو اطمینان دارید؟',
        description: 'در صورت ضبط ویدئو جدید، ویدئو قبلی حذف می‌شود.',
        icon: 'question',
        type: 'Confirmation',
        buttons: [
          {
            id: 'digitalSignatureRetryVideoCancelButton',
            style: 'tinted-on-elevated',
            label: 'بازگشت',
            mode: 'form',
            fullWidth: true,
          },
          {
            id: 'digitalSignatureRetryVideoConfirmButton',
            style: 'fill',
            label: 'ضبط دوباره',
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
      if (data && data.clicked === 'digitalSignatureRetryVideoConfirmButton') {
        this.resetCapturing();
      }
    });
  }

  resetCapturing() {
    this.capturedFile.set(null);
    this.captureStatus.set('STOP');
    this.loadingMedia.set(true);
    setTimeout(() => {
      this.preCapture.set(true);
      this.captureState.set('READY_FOR_CAPTURE_VIDEO');
      this.loadingMedia.set(false);
    }, 1500);
  }

  async submit() {
    this.captureStatus.set('STOP');
    this.captureState.set('READY_FOR_CAPTURE_VIDEO');
    this.uploadingData.set(true);
    const blob = await (await fetch(this.capturedFile()!)).blob();
    if (this.fileSizeExceeded(blob) && this.type() === 'VIDEO') {
      this.error.set(RESPONSE_ERROR_TYPE.VIDEO_SIZE_ERROR);
      this.uploadingData.set(false);
      return;
    }
    const formData = new FormData();
    formData.append('file', blob);
    if (this.type() === 'PHOTO') {
      this.uploadSelfieImage(formData);
    }
    if (this.type() === 'VIDEO') {
      this.uploadVideo(formData, blob.size);
    }
  }

  uploadSelfieImage(formData: FormData) {
    this.creditApiService.uploadDigitalSignatureSelfieImage(formData, this.creditId()).subscribe({
      next: () => {
        this.goNext();
      },
      error: (error) => {
        if (error && error.result) {
          if (error.result.status === RESPONSE_ERROR_STATUS.NATIVE_LIVENESS_MAX_TRY) {
            this.goToTokenExpiration();
            return;
          }
          if (error.result.status === RESPONSE_ERROR_STATUS.DIGITAL_SIGNATURE_ATTEMPT_FAILED) {
            this.showRemainingAttempt(error.remainingAttemptCount, RESPONSE_ERROR_TYPE.PHOTO_ERROR);
            return;
          }
          if (
            error.result.status === RESPONSE_ERROR_STATUS.LIVENESS_PROVIDER_IMAGE_DOES_NOT_MATCH ||
            error.result.status === RESPONSE_ERROR_STATUS.LIVENESS_WRONG_BIRTHDATE_OR_NATIONAL_SERIAL
          ) {
            this.error.set(RESPONSE_ERROR_TYPE.PHOTO_COMPARE_ERROR);
            this.uploadingData.set(false);
            return;
          }
          this.creditGenerateDigitalSignatureService.handleError(error);
          this.uploadingData.set(false);
        } else {
          this.creditGenerateDigitalSignatureService.handleError(error);
          this.uploadingData.set(false);
        }
        this.reCapture();
      },
    });
  }

  uploadVideo(formData: FormData, fileSize: number) {
    this.creditApiService.uploadDigitalSignatureSelfieVideo(formData, this.creditId()).subscribe({
      next: () => {
        this.goNext();
      },
      error: (error) => {
        console.error(error);
        Sentry.captureMessage('Video upload failed', {
          level: 'error',
          tags: {
            video_upload_failed: true,
          },
          extra: {
            fileSizeMb: fileSize / 1024 / 1024,
            originalError: error.message,
            stack: error.stack,
          },
        });
        if (error && error.result) {
          if (error.result.status === RESPONSE_ERROR_STATUS.NATIVE_LIVENESS_MAX_TRY) {
            this.goToTokenExpiration();
            return;
          }
          if (error.result.status === RESPONSE_ERROR_STATUS.DIGITAL_SIGNATURE_ATTEMPT_FAILED) {
            this.showRemainingAttempt(error.remainingAttemptCount, RESPONSE_ERROR_TYPE.VIDEO_ERROR);
            return;
          }
          this.uploadingData.set(false);
          this.creditGenerateDigitalSignatureService.handleError(error);
        } else {
          this.uploadingData.set(false);
          this.creditGenerateDigitalSignatureService.handleError(error);
        }
        this.reCapture();
      },
    });
  }

  cancelRecordingVideo() {
    this.captureStatus.set('STOP');
    this.captureState.set('READY_FOR_CAPTURE_VIDEO');
    this.preCapture.set(true);
    clearTimeout(this.preCaptureTimer);
  }

  backToStart() {
    this.reCapture();
    this.error.set(null);
    this.capturedFile.set(null);
    this.timer.set(this.inputTimer());
    this.getAdmittanceText();
  }

  showRemainingAttempt(remainingAttemptCount: number, error: RESPONSE_ERROR_TYPE) {
    this.ngxStateService.openBottomSheet(
      {
        title: `شما ${translateNumberToPersianString(remainingAttemptCount)} بار دیگر فرصت دارید تا یک عکس یا فیلم واضح ثبت کنید.`,
        description: 'در غیر این صورت، لازم است فرآیند ساخت امضا را از ابتدا شروع کنید.',
        icon: 'warning',
        type: 'Status',
        buttons: [
          {
            id: 'digitalSignatureMaximumRetryButton',
            style: 'fill',
            label: 'متوجه شدم',
            mode: 'form',
            fullWidth: true,
          },
        ],
      },
      { disableClose: true },
    );

    const onClose = this.ngxStateService.onClose().subscribe({
      next: () => {
        onClose.unsubscribe();
        this.uploadingData.set(false);
        this.error.set(error);
      },
    });
  }

  resetDigitalSignatureToken() {
    this.loadingMedia.set(true);
    this.error.set(null);
    this.creditApiService.resetDigitalSignatureStatus(this.creditId()).subscribe({
      next: () => {
        this.backToStepper();
      },
      error: (error) => {
        this.loadingMedia.set(false);
        this.creditGenerateDigitalSignatureService.handleError(error);
      },
    });
  }

  goNext() {
    const currentStep = this.activatedRoute.snapshot.url[0].path;
    const nextStep = this.creditGenerateDigitalSignatureService.getNextStepURL(currentStep);
    if (!nextStep) {
      this.backToStepper();
      return;
    }
    this.router.navigateByUrl(
      this.creditUrlService.getInnerServicePath(`${DigitalSignatureStepperUrl + this.fundProviderCode()}/${this.creditId()}/${nextStep}`),
    );
  }

  backToStepper() {
    this.router.navigateByUrl(
      this.creditUrlService.getInnerServicePath(`${DigitalSignatureStepperUrl + this.fundProviderCode()}/${this.creditId()}`),
    );
  }

  goToTokenExpiration() {
    this.router.navigateByUrl(
      this.creditUrlService.getInnerServicePath(`${DigitalSignatureStepperUrl + this.fundProviderCode()}/${this.creditId()}/token-expired`),
    );
  }

  ngOnDestroy(): void {
    clearInterval(this.counterTimer);
    clearTimeout(this.preCaptureTimer);
  }

  onLogEvent(event: any) {
    Sentry.captureMessage('Face detection event log', {
      level: 'error',
      tags: {
        video_upload_log: true,
      },
      extra: event,
    });
    console.error(event);
  }

  private fileSizeExceeded(file: Blob) {
    const sizeInMb = file.size / 1024 / 1024;
    return sizeInMb > this.maxUploadSize;
  }
}
