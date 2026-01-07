import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  OnInit,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { CreditWallet } from '../../../../data-access/models/credit/wallet/credit-wallet.model';
import { Step } from '../../../../data-access/models/credit/activation/step.model';
import { CreditChequeDocument } from '../../../../data-access/models/credit/activation/cheque-step/cheque-step-detail-response.model';
import { CreditChequeStepService } from '../../services/credit-cheque-step.service';
import { STEP_STATUSES } from '../../../../data-access/models/credit/activation/step-statuses';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { CreditChequeStepCaptureImageComponent } from './credit-cheque-step-capture-image/credit-cheque-step-capture-image.component';
import { CreditAppBarComponent } from '../../../../components/credit-app-bar/credit-app-bar.component';
import { CreditStepperComponent } from '../../../../components/credit-stepper/credit-stepper.component';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';
import { isIOsDevice, isMobileOrTablet } from '../../../../data-access/utils/device';
import { CreditChequeUploadPickerBottomSheetComponent } from './credit-upload-picker-bottom-sheet/credit-cheque-upload-picker-bottom-sheet.component';
import { NetworkConnectionService } from '../../../../data-access/services/network-connection.service';
import { MessageService } from '../../../../data-access/services/message.service';
import { CreditApiService } from '../../../../data-access/services/credit-api.service';
import { CreditPageLoadingComponent } from '../../../../components/credit-page-loading/credit-page-loading.component';
import { CreditChequeStepCameraCaptureComponent } from './credit-cheque-step-camera-capture/credit-cheque-step-camera-capture.component';

@Component({
  selector: 'app-credit-cheque-step-upload-new',
  templateUrl: './credit-cheque-step-upload-new.component.html',
  standalone: true,
  styleUrls: ['./credit-cheque-step-upload-new.component.scss'],
  imports: [
    CreditChequeStepCaptureImageComponent,
    CreditAppBarComponent,
    CreditStepperComponent,
    NgxStatusResultModule,
    CreditPageLoadingComponent,
    CreditChequeStepCameraCaptureComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditChequeStepUploadNewComponent implements OnInit {
  buttons: Buttons[] = [
    {
      id: 'primary',
      mode: 'section',
      label: 'آپلود',
      rightIcon: { name: 'upload' },
      style: 'fill',
    },
  ];
  isOnline = false;

  wallet = input<CreditWallet>();
  step = input<Step>();
  maxUploadSize = input<number>();
  creditId = input.required<string>();
  chequeOrder = input<number>();
  isInstallment = input<boolean>(true);

  finish = output<string>();
  nextStep = output<boolean>();
  prevStep = output();
  goToStep = output<string>();

  transformedStep = signal<Step | null>(null);
  isRelative!: boolean;
  validationResult!: boolean;
  documents: CreditChequeDocument[] = [];
  showCaptureImage = signal(false);
  showCamera = signal<boolean>(false);
  uploading = signal(false);
  uploadError = signal(false);
  selectedFile = signal<File | undefined>(undefined);
  selectedFileBlob = computed(() => {
    if (this.selectedFile()) {
      return URL.createObjectURL(this.selectedFile()!);
    }
    return;
  });

  reload = output<void>();

  uploadInput = viewChild<ElementRef<HTMLInputElement>>('uploadFromDevice');

  private creditApiService = inject(CreditApiService);
  private creditChequeStepService = inject(CreditChequeStepService);
  private bottomSheetService = inject(NgxBottomSheetService);
  private messageService = inject(MessageService);
  private networkConnectionService = inject(NetworkConnectionService);

  constructor() {
    effect(() => {
      const wallet = this.wallet();
      const step = this.step();
      const maxUploadSize = this.maxUploadSize();
      const chequeOrder = this.chequeOrder();
      const creditId = this.creditId();
      if (wallet || step || maxUploadSize || chequeOrder || creditId) {
        untracked(() => {
          this.transformStep();
        });
      }
    });
  }

  ngOnInit() {
    this.networkConnectionService.onConnectionStatusChange().subscribe((isOnline) => {
      this.isOnline = isOnline;
    });
    this.checkCam();
    this.isRelative = this.creditChequeStepService.data.ownerRelative !== 0;
    this.creditChequeStepService.documents.subscribe((documents) => {
      if (this.chequeOrder()) {
        this.documents = documents.filter((_, index) => index === this.chequeOrder()! - 1);
      } else {
        this.documents = documents;
      }
      this.transformStep();
    });
  }

  checkCam(): void {
    if (isMobileOrTablet() || isIOsDevice()) {
      this.showCamera.set(true);
    }
  }

  openPicker() {
    if (!this.showCamera()) {
      this.uploadInput()?.nativeElement.click();
    } else {
      this.pickFile();
    }
  }

  selectFile(event: any) {
    if (event.target.files?.[0]) {
      this.selectedFile.set(event.target.files?.[0]);
    }
  }

  onConfirm() {
    this.uploadFile(this.selectedFile()!)
      .then(() => {
        this.onFinish();
      })
      .catch(() => {
        this.selectedFile.set(undefined);
        const uploadInput = this.uploadInput();
        if (uploadInput?.nativeElement) {
          uploadInput.nativeElement.value = '';
        }
      });
  }

  pickFile() {
    this.bottomSheetService.openBottomSheet(CreditChequeUploadPickerBottomSheetComponent, {}, { noPadding: true });

    const bottomSheetService = this.bottomSheetService.onClose.subscribe(() => {
      bottomSheetService.unsubscribe();
      const result = this.bottomSheetService.outputData();

      if (result) {
        switch (result) {
          case 'gallery':
            this.uploadInput()?.nativeElement.click();
            break;
          case 'camera':
            this.showCaptureImage.set(true);
            break;
        }
      }
    });
  }

  uploadFile(file: File): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const validTypes = ['image/jpg', 'image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        this.messageService.showErrorMessage('فقط فایل‌های JPEG و PNG مجاز هستند');
        reject('File format not supported');
        this.selectedFile.set(undefined);
        return;
      }

      if (!this.checkFileSize(file)) {
        this.messageService.showErrorMessage('سایز فایل انتخاب شده بیش از حد مجاز است');
        reject('File size exceeds the allowed limit');
        this.selectedFile.set(undefined);
        return;
      }

      if (!this.isOnline) {
        this.messageService.showErrorMessage('لطفا اتصال اینترنت را بررسی کنید');
        reject('No internet connection');
        this.selectedFile.set(undefined);
        return;
      }

      this.uploading.set(true);
      this.uploadError.set(false);

      this.creditApiService
        .uploadDocument(
          this.isInstallment(),
          file,
          this.wallet()!.creditId!,
          +this.wallet()!.fundProviderCode,
          this.transformedStep()!.child[0]!.stepTag,
          this.chequeOrder()!,
        )
        .subscribe({
          next: () => {
            this.uploading.set(false);
            resolve(true);
          },
          error: (e: any) => {
            this.uploading.set(false);
            if (e && e.result && e.result.message) {
              this.messageService.showErrorOfErrorResponse(e);
              reject(e.result.message);
            } else {
              if (!this.isOnline) {
                this.messageService.showErrorMessage('لطفا اتصال اینترنت را بررسی کنید');
                reject('No internet connection');
              } else {
                this.messageService.showErrorMessage('بروز خطا در هنگام بارگذاری فایل');
                reject('Error uploading file');
              }
            }
          },
        });
    });
  }

  checkValidation() {
    let valid = true;
    this.transformedStep()?.child.map((item) => {
      if (!item.disabled && !item.stepResult) {
        valid = false;
      }
      if (STEP_STATUSES[item.status] === 'OPERATIONAL_REJECTION') {
        valid = false;
      }
    });
    this.validationResult = valid;
  }

  transformStep() {
    // I don't like this code too - I hope I can refactor this soon
    const step = {
      active: true,
      color: 0,
      kind: this.isInstallment() ? 'INSTALLMENT_CHEQUE' : 'CHEQUE',
      moreInfo: false,
      open: false,
      state: '',
      stepTag: 8,
      stepTagText: null,
      typeText: null,
    };
    const newChildren: any[] = [];
    this.documents.map((doc) => {
      const newChild = Object.assign({}, step, {
        code: doc.tag,
        disabled: doc.option === 2 && !this.isRelative,
        option: doc.option,
        primary: doc.option === 1 || (doc.option === 2 && this.isRelative),
        stepResult: doc.docId,
        stepTag: doc.tag,
        title: 'تصویر روی ' + doc.title,
        image: doc.imageId ? doc.imageId : null,
        status: this.convertDocStatusToStepStatus(doc.status),
        statusText: this.convertDocStatusToStepStatusText(doc.status),
      });
      if (!newChild.disabled) {
        newChildren.push(newChild);
      }
    });
    const newStep = Object.assign({}, this.step());
    newStep.child = newChildren;
    this.transformedStep.set(newStep);
    this.checkValidation();
  }

  convertDocStatusToStepStatus(status: string | number) {
    const map: { [key: number]: number } = {
      0: 0,
      1: 2,
      2: 3,
      3: 4,
    };
    return map[Number(status)] ? map[Number(status)] : map[0];
  }

  convertDocStatusToStepStatusText(status: string | number) {
    const map: { [key: number]: string } = {
      0: 'INITIATE',
      1: 'INITIATE',
      2: 'COMPLETED',
      3: 'OPERATIONAL_REJECTION',
    };
    return map[Number(status)] ? map[Number(status)] : map[0];
  }

  setCapturedFile(file: File) {
    this.showCaptureImage.set(false);
    this.uploadFile(file).then(() => {
      this.onFinish();
    });
  }

  onFinish() {
    this.finish.emit('SAYAD');
  }

  private checkFileSize(file: File) {
    const sizeInMb = file.size / 1024 / 1024;
    return sizeInMb < this.maxUploadSize()!;
  }
}
