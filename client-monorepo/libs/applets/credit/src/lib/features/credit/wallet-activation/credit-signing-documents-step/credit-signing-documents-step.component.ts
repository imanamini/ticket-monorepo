import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditApiService } from '../../data-access/services/credit-api.service';
import { CreditUrlService } from '../../data-access/utils/url';
import { MessageService } from '../../data-access/services/message.service';
import { SigningDocumentsStepStatus } from '../../data-access/models/credit/activation/signing-documents-step/signing-documents-step-status';
import { CreditSigningDocumentsOnBoardingComponent } from './credit-signing-documents-on-boarding/credit-signing-documents-on-boarding.component';
import { CreditSigningDocumentsInProgressComponent } from './credit-signing-documents-in-progress/credit-signing-documents-in-progress.component';
import { CreditSigningDocumentsReadyToSignComponent } from './credit-signing-documents-ready-to-sign/credit-signing-documents-ready-to-sign.component';
import { CreditSigningDocumentsDigitalSignatureRevokedComponent } from './credit-signing-document-digital-signature-revoked/credit-signing-documents-digital-signature-revoked.component';
import { NgxStateService } from '@digipay/ngx-status-result';
import { CreditEnoteStepErrorComponent } from '../credit-enote-step/credit-enote-step-error/credit-enote-step-error.component';
import { CreditPageLoadingComponent } from '../../components/credit-page-loading/credit-page-loading.component';
import { CreditSigningDocumentsErrorComponent } from './credit-signing-documents-error/credit-signing-documents-error.component';

@Component({
  selector: 'app-credit-signing-documents-step',
  templateUrl: './credit-signing-documents-step.component.html',
  styleUrls: ['./credit-signing-documents-step.component.scss'],
  imports: [
    CreditSigningDocumentsOnBoardingComponent,
    CreditSigningDocumentsInProgressComponent,
    CreditSigningDocumentsReadyToSignComponent,
    CreditSigningDocumentsDigitalSignatureRevokedComponent,
    CreditEnoteStepErrorComponent,
    CreditPageLoadingComponent,
    CreditSigningDocumentsErrorComponent,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditSigningDocumentsStepComponent implements OnInit {
  fundProviderCode!: number;
  creditId = signal<string | undefined>(undefined);
  showLoading = signal<boolean | null>(null);
  state = signal<
    'ON_BOARDING' | 'IN_PROGRESS' | 'SIGNING' | 'PASSWORD_REVOKED' | 'NO_SERVICE' | 'EXPIRED' | 'DIGITAL_SIGNATURE_EXPIRED' | null
  >(null);
  needPassword = signal(false);
  inProgressCountDown = signal(30);
  continueSigning = signal<boolean | null>(null);
  rollbackUrl!: string;
  isExpired = signal(false);

  private activatedRoute = inject(ActivatedRoute);
  private creditApiService = inject(CreditApiService);
  private creditUrlService = inject(CreditUrlService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private ngxStateService = inject(NgxStateService);

  ngOnInit(): void {
    this.fundProviderCode = +this.activatedRoute.snapshot.params['fundProviderCode'];
    this.creditId.set(this.activatedRoute.snapshot.params['creditId']);
    this.getData();
  }

  getData() {
    this.showLoading.set(true);
    this.creditApiService.getSigningDocumentsStatus(this.creditId()!).subscribe({
      next: (response) => {
        this.needPassword.set(response.isNeedPassword);
        switch (response.status) {
          case SigningDocumentsStepStatus.INITIATED:
            this.state.set('ON_BOARDING');
            break;
          case SigningDocumentsStepStatus.IN_PROGRESS:
            this.state.set('IN_PROGRESS');
            break;
          case SigningDocumentsStepStatus.READY_TO_SIGN:
            this.state.set('SIGNING');
            break;
          case SigningDocumentsStepStatus.COMPLETED:
            this.showRevokeDigitalSignatureBottomSheet();
            return;
          case SigningDocumentsStepStatus.FAILED:
            this.state.set('EXPIRED');
            break;
          case SigningDocumentsStepStatus.EXPIRED:
            this.state.set('DIGITAL_SIGNATURE_EXPIRED');
            break;
        }
        this.showLoading.set(false);
      },
      error: (error) => {
        if (this.messageService.isNoServiceError(error)) {
          this.showLoading.set(false);
          this.state.set('NO_SERVICE');
        } else if (this.messageService.isEnoteExpiredError(error)) {
          this.showLoading.set(false);
          this.isExpired.set(true);
          this.rollbackUrl = error.redirectUrl;
        } else {
          this.messageService.showErrorOfErrorResponse(error);
          this.closeStep();
        }
      },
    });
  }

  showRevokeDigitalSignatureBottomSheet() {
    this.showLoading.set(true);
    this.ngxStateService.openBottomSheet(
      {
        title: 'آیا تمایل به حذف امضای خود دارید؟',
        description:
          'اطلاعات شما به‌صورت کاملاً ایمن و محرمانه نزد ما نگهداری می‌شود و هیچ‌گونه استفاده‌ای از آن نخواهد شد. تنها شما قادر به استفاده از امضای خود هستید.',
        icon: 'question',
        type: 'Confirmation',
        buttons: [
          {
            id: 'digitalSignatureRevokeConfirmButton',
            style: 'tinted-on-elevated',
            label: 'حذف امضا',
            mode: 'form',
            fullWidth: true,
            destructive: true,
          },
          {
            id: 'digitalSignatureRevokeCancelButton',
            style: 'fill',
            label: 'خیر',
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
      if (data && data.clicked === 'digitalSignatureRevokeConfirmButton') {
        this.creditApiService.revokeCreditDigitalSignature(this.creditId()!).subscribe({
          next: () => {
            this.state.set('PASSWORD_REVOKED');
            this.showLoading.set(false);
          },
          error: (error) => {
            this.messageService.showErrorOfErrorResponse(error);
            this.showRevokeDigitalSignatureBottomSheet();
          },
        });
      } else {
        this.goNextStep();
      }
    });
  }

  showNoService(): void {
    this.messageService
      .showBlockedError({
        title: 'اشکال در اتصال به سرویس‌دهنده',
        message: 'به محض برقراری ارتباط برای ادامه فرآیند ثبت‌نام، از طریق پیامک اطلاع‌رسانی خواهیم کرد.',
        staticImage: 'no-service',
        primaryCta: 'متوجه شدم',
        secondaryCta: '',
      })
      .then(({ primary }) => {
        if (primary) {
          this.closeStep();
        }
      });
  }

  closeStep() {
    this.router.navigateByUrl(
      this.creditUrlService.getInnerServicePath(`/wallet/activation/steps/${this.fundProviderCode}/${this.creditId()}`),
    );
  }

  onSignedDocument() {
    this.continueSigning.set(true);
    this.getData();
  }

  rollbackAndRedirect(): void {
    this.showLoading.set(true);
    const state = {
      isExpired: false,
    };
    this.creditApiService.rollbackEnote(this.rollbackUrl, this.creditId()!).subscribe({
      next: () => {
        this.router.navigateByUrl(
          this.creditUrlService.getInnerServicePath(`/wallet/activation/enote/resolve/${this.fundProviderCode}/${this.creditId()}`),
          { state },
        );
        this.showLoading.set(false);
      },
    });
  }

  goNextStep() {
    this.router.navigateByUrl(
      this.creditUrlService.getInnerServicePath(`/wallet/activation/steps/${this.fundProviderCode}/${this.creditId()}/next`),
    );
  }
}
