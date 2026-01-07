import { AfterViewInit, ChangeDetectionStrategy, Component, computed, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditUrlService } from '../../../data-access/utils/url';
import { CreditGenerateDigitalSignatureService } from '../services/credit-generate-digital-signature.service';
import SignaturePad from 'signature_pad';
import { CreditApiService } from '../../../data-access/services/credit-api.service';
import {
  DigitalSignatureStepperUrl,
  RESPONSE_ERROR_STATUS,
} from '../credit-generate-digital-signature-step/general-digital-signature-steps.model';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { translateNumberToPersianString } from '../../../data-access/utils/strings';
import { NgxStateService } from '@digipay/ngx-status-result';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';
import { CreditStepperComponent } from '../../../components/credit-stepper/credit-stepper.component';
import { CreditScrollableViewComponent } from '../../../components/credit-scrollable-view/credit-scrollable-view.component';

@Component({
  selector: 'app-credit-generate-digital-signature-wet-sign',
  templateUrl: './credit-generate-digital-signature-wet-sign.component.html',
  styleUrl: './credit-generate-digital-signature-wet-sign.component.scss',
  imports: [NgxButtonComponent, NgxTrackableIdDirective, CreditAppBarComponent, CreditStepperComponent, CreditScrollableViewComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditGenerateDigitalSignatureWetSignComponent implements OnInit, AfterViewInit {
  signaturePad!: SignaturePad;
  canvasEl = viewChild<ElementRef>('canvas');
  creditId = '';
  fundProviderCode = '';
  signed = signal<boolean>(false);
  signTitle = computed(() => (this.signed() ? 'نمونه امضای شما مانند پائین ثبت شد.' : 'نمونه امضای خود را در کادر زیر بکشید.'));
  signSubtitle = computed(() =>
    this.signed()
      ? 'نیازی نیست که در کشیدن نمونه امضا وسواس به خرج دهید؛ این مرحله فقط برای ثبت یک نمونه است.'
      : 'با لمس صفحه گوشی هوشمند یا استفاده از ماوس در رایانه، امضای خود را رسم کنید.',
  );
  showLoading = signal(false);
  numberOfDrawingRetries = 0;
  maximumDrawingRetry = 2;
  public creditGenerateDigitalSignatureService = inject(CreditGenerateDigitalSignatureService);
  protected readonly location = location;
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private creditUrlService = inject(CreditUrlService);
  private creditApiService = inject(CreditApiService);
  private ngxStateService = inject(NgxStateService);

  ngOnInit() {
    this.creditId = this.activatedRoute.parent?.snapshot.params['creditId'];
    this.fundProviderCode = this.activatedRoute.parent?.snapshot.params['fundProviderCode'];
    this.setCurrentStep();
  }

  setCurrentStep() {
    const currentStep = this.activatedRoute.snapshot.url[0].path;
    this.creditGenerateDigitalSignatureService.setCurrentStep(currentStep);
    this.creditGenerateDigitalSignatureService.setDigitalSignatureAutoNavigation(false);
  }

  ngAfterViewInit() {
    this.signaturePad = new SignaturePad(this.canvasEl()?.nativeElement, {
      minWidth: 1,
      maxWidth: 1,
    });
    this.canvasEl()?.nativeElement.addEventListener('pointerdown', this.updateSign.bind(this));
    this.canvasEl()?.nativeElement.addEventListener('touchstart', this.updateSign.bind(this));
  }

  updateSign() {
    this.signed.set(true);
  }

  reSign(manuallyResigned = false) {
    if (this.numberOfDrawingRetries < this.maximumDrawingRetry) {
      this.signed.set(false);
      this.signaturePad.clear();
      this.numberOfDrawingRetries++;
      return;
    }
    if (manuallyResigned) {
      this.ngxStateService.openBottomSheet(
        {
          title: `توجه داشته باشید که`,
          description: 'نیازی نیست نمونه امضا دقیقاً مشابه امضای اصلی شما باشد. لطفاً بدون وسواس، امضای خود را رسم کنید.',
          icon: 'info',
          type: 'Status',
          buttons: [
            {
              id: 'digitalSignatureWetRetryConfirmButton',
              style: 'fill',
              label: 'تایید امضای قبلی',
              mode: 'form',
              fullWidth: true,
            },
            {
              id: 'digitalSignatureWetRetryCancelButton',
              style: 'tinted-on-elevated',
              label: 'ثبت دوباره امضا',
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
          const data = this.ngxStateService.outputData();
          if (data && data.clicked === 'digitalSignatureWetRetryConfirmButton') {
            this.submit().then();
          } else {
            this.signed.set(false);
            this.signaturePad.clear();
          }
        },
      });
    }
  }

  async submit() {
    this.showLoading.set(true);
    const blob = await (await fetch(this.signaturePad.toDataURL())).blob();
    const formData = new FormData();
    formData.append('file', blob);
    this.creditApiService.uploadWetDigitalSignature(formData, this.creditId).subscribe({
      next: () => {
        this.showLoading.set(false);
        this.goNext();
      },
      error: (error) => {
        this.showLoading.set(false);
        if (error && error.result) {
          if (error.result.status === RESPONSE_ERROR_STATUS.NATIVE_LIVENESS_MAX_TRY) {
            this.goToTokenExpiration();
            return;
          }
          if (error.result.status === 5359) {
            this.showRemainingAttempt(error.remainingAttemptCount);
            return;
          }
          this.creditGenerateDigitalSignatureService.handleError(error);
        } else {
          this.creditGenerateDigitalSignatureService.handleError(error);
        }
      },
    });
  }

  showRemainingAttempt(remainingAttemptCount: number) {
    this.ngxStateService.openBottomSheet(
      {
        title: `شما ${translateNumberToPersianString(remainingAttemptCount)} بار دیگر فرصت دارید تا امضای خود را ثبت کنید.`,
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
        this.reSign();
      },
    });
  }

  returnToStepper() {
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

  backToStepper() {
    this.router.navigateByUrl(
      this.creditUrlService.getInnerServicePath(`${DigitalSignatureStepperUrl + this.fundProviderCode}/${this.creditId}`),
    );
  }

  goToTokenExpiration() {
    this.router.navigateByUrl(
      this.creditUrlService.getInnerServicePath(`${DigitalSignatureStepperUrl + this.fundProviderCode}/${this.creditId}/token-expired`),
    );
  }
}
