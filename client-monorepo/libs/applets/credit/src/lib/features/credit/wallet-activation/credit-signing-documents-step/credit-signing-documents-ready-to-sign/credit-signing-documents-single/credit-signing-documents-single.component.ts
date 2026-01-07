import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  Inject,
  input,
  model,
  OnInit,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { GetSigningDocumentsItem } from '../../../../data-access/models/credit/activation/signing-documents-step/get-signing-documents-item';
import { CreditApiService } from '../../../../data-access/services/credit-api.service';
import { MessageService } from '../../../../data-access/services/message.service';
import { BaseApiService } from '../../../../data-access/services/base-api.service';
import { SigningDocumentItemStatus } from '../../../../data-access/models/credit/activation/signing-documents-step/signing-document-item-status';
import { CREDIT_ENVIRONMENT, CreditEnvironmentInterface } from '../../../../credit-environment.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditUrlService } from '../../../../data-access/utils/url';
import { isIOsDevice } from '../../../../data-access/utils/device';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { CreditSigningDocumentsErrorComponent } from '../../credit-signing-documents-error/credit-signing-documents-error.component';
import { CreditSigningDocumentPasswordComponent } from '../credit-signing-document-password/credit-signing-document-password.component';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';
import { CreditEnoteStepErrorComponent } from '../../../credit-enote-step/credit-enote-step-error/credit-enote-step-error.component';
import { CreditPageLoadingComponent } from '../../../../components/credit-page-loading/credit-page-loading.component';
import { CreditAppBarComponent } from '../../../../components/credit-app-bar/credit-app-bar.component';
import { CreditDigipayImageComponent } from '../../../../components/credit-digipay-image/credit-digipay-image.component';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { CreditSigningDocumentsSignedBottomSheetComponent } from '../credit-signing-documents-signed-bottom-sheet/credit-signing-documents-signed-bottom-sheet.component';

@Component({
  selector: 'app-credit-signing-documents-single',
  templateUrl: './credit-signing-documents-single.component.html',
  styleUrls: ['./credit-signing-documents-single.component.scss'],
  standalone: true,
  imports: [
    PipesModule,
    PdfViewerModule,
    NgxButtonComponent,
    CreditSigningDocumentsErrorComponent,
    CreditSigningDocumentPasswordComponent,
    NgxTrackableIdDirective,
    NgxSpinnerModule,
    CreditEnoteStepErrorComponent,
    CreditPageLoadingComponent,
    CreditAppBarComponent,
    CreditDigipayImageComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditSigningDocumentsSingleComponent implements OnInit {
  creditId = input.required<string>();
  document = model<GetSigningDocumentsItem>();
  progressInfo = input<{ index: number; total: number }>();
  fullName = input<string>();
  fundProviderIcon = input<string>();
  needPassword = input<boolean>();

  progressBarCompletedWidth = computed<string>(() => {
    if (!this.document() || !this.progressInfo()) {
      return '';
    }
    const signed =
      this.document()?.status === SigningDocumentItemStatus.SIGNED || this.document()?.status === SigningDocumentItemStatus.SEALED;
    if (signed) {
      return Math.floor(100 * (this.progressInfo()!.index! / this.progressInfo()!.total!)) + '%';
    } else {
      return Math.floor(100 * ((this.progressInfo()!.index! - 1) / this.progressInfo()!.total!)) + '%';
    }
  });
  progressBarInProgressWidth = computed<string>(() => {
    if (!this.document() || !this.progressInfo()) {
      return '';
    }
    const signed =
      this.document()?.status === SigningDocumentItemStatus.SIGNED || this.document()?.status === SigningDocumentItemStatus.SEALED;
    if (signed) {
      return '0';
    } else {
      return Math.floor(100 / this.progressInfo()!.total!) + '%';
    }
  });
  signImageId = signal<string | null>(null);
  page = signal(1);
  totalPage = signal<number | null>(null);
  docStatusEnum = SigningDocumentItemStatus;
  errorText = signal('');
  errorDescription = signal('');
  back = output<void>();
  finish = output<void>();
  fileData = signal<Uint8Array | undefined>(undefined);
  loadedDoc = signal<string | null>(null);
  numberMapper: { [key: number]: string } = {
    1: 'اول',
    2: 'دوم',
    3: 'سوم',
    4: 'چهارم',
    5: 'پنجم',
    6: 'ششم',
    7: 'هفتم',
    8: 'هشتم',
    9: 'نهم',
    10: 'دهم',
    11: 'یازدهم',
    12: 'دوازدهم',
    13: 'سیزدهم',
    14: 'چهاردهم',
    15: 'پانزدهم',
    16: 'شانزدهم',
    17: 'هفدهم',
    18: 'هجدهم',
    19: 'نوزدهم',
    20: 'بیستم',
  };
  documentCount = computed(() =>
    this.progressInfo() ? this.numberMapper[this.progressInfo()!.index!] || this.progressInfo()!.index + 'ام' : '',
  );
  errorMap: {
    [key: number]:
      | 'ERROR'
      | 'NO_SERVICE'
      | 'EXPIRED'
      | 'CREDIT_ONB_SIGNING_DOCUMENT_PASSWORD_INCORRECT'
      | 'CREDIT_ONB_SIGNING_DOCUMENT_EXPIRED'
      | null;
  } = {
    16108: 'ERROR',
    1118: 'NO_SERVICE',
    5344: 'EXPIRED',
    5345: 'CREDIT_ONB_SIGNING_DOCUMENT_PASSWORD_INCORRECT',
    5346: 'CREDIT_ONB_SIGNING_DOCUMENT_EXPIRED',
  };
  ctaLoading = signal<boolean>(false);
  errorType = signal<
    'NO_SERVICE' | 'ERROR' | 'EXPIRED' | 'CREDIT_ONB_SIGNING_DOCUMENT_PASSWORD_INCORRECT' | 'CREDIT_ONB_SIGNING_DOCUMENT_EXPIRED' | null
  >(null);
  fullscreen = signal<boolean | null>(null);
  rollbackUrl!: string;
  loading = signal(false);
  showPassword = signal(false);
  passwordExpired = signal(false);
  docPreview = viewChild<ElementRef<HTMLDivElement>>('docPreview');
  zoom = signal(100);
  zoomStep = 20;
  maxZoom = 200;
  minZoom = 100;
  fundProviderCode!: number;

  private apiService = inject(BaseApiService);
  private creditApiService = inject(CreditApiService);
  private messageService = inject(MessageService);
  private creditUrlService = inject(CreditUrlService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private bottomSheetService = inject(NgxBottomSheetService);

  constructor(
    @Inject(CREDIT_ENVIRONMENT)
    private creditEnvironment: CreditEnvironmentInterface,
  ) {
    effect(
      () => {
        const documentValue = this.document();
        if (documentValue) {
          untracked(() => this.getPdfFile(this.document()!.docId!));
        }
      },
      { allowSignalWrites: true },
    );
  }

  ngOnInit(): void {
    this.fundProviderCode = +this.activatedRoute.snapshot.params['fundProviderCode'];
    this.getSignImage();
  }

  getSignImage(): void {
    this.creditApiService.getDigitalSignatureImage().subscribe((response) => {
      this.signImageId.set(response.imageId);
    });
  }

  checkPasswordBeforeSubmit() {
    if (this.needPassword() && this.document()?.status === SigningDocumentItemStatus.READY_TO_SIGN) {
      this.showPassword.set(true);
      return;
    }
    this.submit();
  }

  submit(password?: string) {
    this.errorType.set(null);
    if (this.document()?.status === SigningDocumentItemStatus.SIGNED || this.document()?.status === SigningDocumentItemStatus.SEALED) {
      this.finish.emit();
      return;
    }
    this.ctaLoading.set(true);
    this.creditApiService.signDocument(this.creditId(), this.document()!.trackingCode, password).subscribe({
      next: () => {
        this.ctaLoading.set(false);
        this.showPassword.set(false);
        this.updateDocumentData();
      },
      error: (error) => {
        console.error(error, this.document()?.trackingCode, this.creditId());
        if (error && error.result && error.result.status in this.errorMap) {
          this.errorType.set(this.errorMap[error.result.status]);
          if (this.errorType() === 'CREDIT_ONB_SIGNING_DOCUMENT_PASSWORD_INCORRECT') {
            this.errorText.set(error.originalResponseDesc);
            this.ctaLoading.set(false);
            return;
          }
          if (this.errorType() === 'CREDIT_ONB_SIGNING_DOCUMENT_EXPIRED') {
            this.errorText.set(error.result.message);
            this.errorDescription.set(error.originalResponseDesc);
            this.passwordExpired.set(true);
            this.ctaLoading.set(false);
            return;
          }

          this.showPassword.set(false);
          if (error.redirectUrl) {
            this.rollbackUrl = error.redirectUrl;
          }
        } else {
          this.messageService.showErrorOfErrorResponse(error);
        }
        this.ctaLoading.set(false);
      },
    });
  }

  updateDocumentData(): void {
    this.ctaLoading.set(true);
    this.creditApiService.getSigningDocumentByTrackingCode(this.creditId()!, this.document()!.trackingCode!).subscribe((response) => {
      if (response) {
        this.document.set(response);
        this.bottomSheetService.openBottomSheet(
          CreditSigningDocumentsSignedBottomSheetComponent,
          {
            document: this.document(),
            signImageId: this.signImageId(),
            fullName: this.fullName(),
            progressInfo: this.progressInfo(),
          },
          { noPadding: true },
        );

        const onClose = this.bottomSheetService.onClose.subscribe({
          next: () => {
            onClose.unsubscribe();
            this.checkPasswordBeforeSubmit();
          },
        });
      }
      this.ctaLoading.set(false);
    });
  }

  onCancelPassword() {
    this.showPassword.set(false);
    this.errorType.set(null);
    this.errorText.set('');
  }

  onBack() {
    this.back.emit();
  }

  onPage($event: any) {
    if ($event && $event.source && $event.source._pages && $event.source._pages.length) {
      this.totalPage.set($event.source._pages.length);
    }
  }

  goToFullScreen() {
    if (this.creditEnvironment.creditEnv === 'mini-app' || isIOsDevice()) {
      this.fullscreen.set(!this.fullscreen());
      return;
    }
    const elem: any = this.docPreview()?.nativeElement;
    if (!this.isFullScreen()) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        /* Safari */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        /* IE11 */
        elem.msRequestFullscreen();
      }
    } else {
      const d: any = document;
      if (d.exitFullscreen) {
        d.exitFullscreen();
      } else if (d.webkitExitFullscreen) {
        /* Safari */
        d.webkitExitFullscreen();
      } else if (d.msExitFullscreen) {
        /* IE11 */
        d.msExitFullscreen();
      }
    }
  }

  onFullscreenChange() {
    this.fullscreen.set(this.isFullScreen());
    this.zoom.set(100);
  }

  isFullScreen(): boolean {
    if (this.creditEnvironment.creditEnv === 'mini-app') {
      return <boolean>this.fullscreen();
    }
    const d: any = document;
    return !(!d.fullscreenElement && !d.webkitIsFullScreen && !d.mozFullScreen && !d.msFullscreenElement);
  }

  zoomIn(): void {
    if (this.zoom() + this.zoomStep <= this.maxZoom) {
      this.zoom.update((zoom) => zoom + this.zoomStep);
    }
  }

  zoomOut() {
    if (this.zoom() - this.zoomStep >= this.minZoom) {
      this.zoom.update((zoom) => zoom - this.zoomStep);
    }
  }

  rollbackAndRedirect(): void {
    this.loading.set(true);
    const state = {
      isExpired: false,
    };
    this.creditApiService.rollbackEnote(this.rollbackUrl, this.creditId()!).subscribe({
      next: () => {
        this.router.navigateByUrl(
          this.creditUrlService.getInnerServicePath(`/wallet/activation/enote/resolve/${this.fundProviderCode}/${this.creditId()}`),
          { state },
        );
        this.loading.set(false);
      },
    });
  }

  private getPdfFile(docId: string): void {
    if (docId === this.loadedDoc()) {
      return;
    }
    this.loadedDoc.set(null);
    this.page.set(1);
    this.totalPage.set(0);
    this.apiService.getCreditImage(docId).subscribe({
      next: (res) => {
        res.arrayBuffer().then((arrayBuffer: ArrayBuffer) => {
          const unit8Array = new Uint8Array(arrayBuffer);
          this.fileData.set(unit8Array);
        });
        this.loadedDoc.set(docId);
      },
      error: (e) => {
        this.messageService.showErrorOfErrorResponse(e);
      },
    });
  }
}
