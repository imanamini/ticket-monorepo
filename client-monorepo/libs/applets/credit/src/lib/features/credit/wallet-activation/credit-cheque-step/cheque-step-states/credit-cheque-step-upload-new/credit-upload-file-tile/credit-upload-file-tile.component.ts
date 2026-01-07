import { ChangeDetectionStrategy, Component, computed, effect, Inject, inject, input, OnInit, output, signal } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';
import { Step } from '../../../../../data-access/models/credit/activation/step.model';
import { CreditApiService } from '../../../../../data-access/services/credit-api.service';
import { CreditWallet } from '../../../../../data-access/models/credit/wallet/credit-wallet.model';
import { MessageService } from '../../../../../data-access/services/message.service';
import { NetworkConnectionService } from '../../../../../data-access/services/network-connection.service';
import { CreditFilePickerComponent } from '../../../../../components/credit-file-picker/credit-file-picker.component';
import { CreditImageDialogComponent } from '../../../../../components/credit-image-dialog/credit-image-dialog.component';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { hasWebCam, isMobileOrTablet } from '../../../../../data-access/utils/device';
import { CREDIT_ENVIRONMENT, CreditEnvironmentInterface } from '../../../../../credit-environment.interface';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';
import { CameraConfig, ImageConfig, ImageMode, NgxUploaderComponent } from '@digipay/ngx-uploader';

@Component({
  selector: 'app-credit-upload-file-tile',
  templateUrl: './credit-upload-file-tile.component.html',
  styleUrls: ['./credit-upload-file-tile.component.scss'],
  standalone: true,
  imports: [NgxSpinnerModule, NgxUploaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditUploadFileTileComponent implements OnInit {
  creditImageBaseUrl = '/digipay/api/contents/';
  currentlySelectedFile: File | null = null;
  isOnline = false;
  file!: File;
  borderColor!: string;
  cameraConfig: CameraConfig = {
    visible: true,
    text: 'عکاسی از چک',
    cameraPage: {
      title: 'تصویر روی چک',
      description: 'توجه داشته باشید که متن روی چک باید کاملا خوانا باشد و نباید تار باشد.',
      capturingDescription: 'چهار طرف چک خود را در این کادر قرار دهید',
    },
  };
  imageId = new FormControl('');

  step = input<Step>();
  title = input<string>();
  creditWallet = input<CreditWallet>();
  disabled = input<boolean>(false);
  chequeOrder = input<number>();
  maxUploadSize = input<number>();
  isInstallment = input<boolean>(true);
  capturedImageEvent = input<File>();

  fileImageSrc = signal<SafeUrl | null>(null);
  showCamera = signal<boolean>(false);
  uploading = signal(false);
  uploadError = signal(false);
  loading = signal(false);
  previewUrl = signal(this.step()?.stepResult);

  statusText = computed(() => this.step()?.statusText);
  imageMode = computed(() => (this.previewUrl() ? ImageMode.ImageID : undefined));
  imageConfig = computed<ImageConfig>(() => {
    return {
      imageMode: this.imageMode(),
      previewUrl: this.previewUrl(),
      imageAcceptedFormats: ['png'],
      imageSize: 'lg',
      image: {
        file: null,
        state: this.uploading() ? 'uploading' : this.previewUrl() ? 'uploaded' : 'rest',
        url: this.previewUrl(),
      },
    };
  });

  uploadSuccess = output<boolean>();
  gotoCamera = output<void>();
  removeFile = output<void>();

  bottomSheetService = inject(NgxBottomSheetService);
  sanitizer = inject(DomSanitizer);
  credit = inject(CreditApiService);
  ms = inject(MessageService);
  networkConnectionService = inject(NetworkConnectionService);

  constructor(
    @Inject(CREDIT_ENVIRONMENT)
    private creditEnvironment: CreditEnvironmentInterface,
  ) {
    effect(
      () => {
        const capturedImage = this.capturedImageEvent();
        if (capturedImage) {
          this.uploadFile(capturedImage);
        }
      },
      { allowSignalWrites: true },
    );
    this.networkConnectionService.onConnectionStatusChange().subscribe((isOnline) => {
      this.isOnline = isOnline;
    });
    this.checkCam();
  }

  ngOnInit() {
    this.previewUrl.set(this.step()?.stepResult);
  }

  checkCam(): void {
    if (isMobileOrTablet()) {
      hasWebCam()
        .then(() => {
          this.showCamera.set(true);
        })
        .catch(() => {
          this.showCamera.set(false);
        });
    }
  }

  onRemoveFile() {
    this.loading.set(true);
    this.previewUrl.set(undefined);
    this.fileImageSrc.set(null);
    this.removeFile.emit();
    setTimeout(() => {
      this.loading.set(false);
    });
  }

  /**
   * Pick file again
   * Deprecated: Since using ngx-uploader
   * @param $event
   */
  pickAgain($event: Event) {
    if (this.statusText() !== 'COMPLETED') {
      this.pickFile();
    } else {
      $event.stopPropagation();
      $event.preventDefault();
    }
  }

  /**
   * Deprecated: Since there is only one option in the bottom sheet,
   * there is no need to show it anymore.
   */
  pickFile() {
    this.bottomSheetService.openBottomSheet(CreditFilePickerComponent, {
      showDelete: false,
      showCamera: this.showCamera(),
    });

    const bottomSheetService = this.bottomSheetService.onClose.subscribe(() => {
      bottomSheetService.unsubscribe();
      const result = this.bottomSheetService.outputData();
      if (result) {
        switch (result.action) {
          case 'delete':
            break;
          case 'file':
            if (result.file) {
              this.uploadFile(result.file);
            }
            break;
          case 'camera':
            this.gotoCamera.emit();
            break;
        }
      }
    });
  }

  /**
   * Upload file
   *
   * @param file
   */
  uploadFile(file: File): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const validTypes = ['image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        this.currentlySelectedFile = null;
        this.ms.showErrorMessage('فقط فایل‌های JPEG و PNG مجاز هستند');
        reject('File format not supported');
        return;
      }

      if (!this.checkFileSize(file)) {
        this.currentlySelectedFile = null;
        this.ms.showErrorMessage('سایز فایل انتخاب شده بیش از حد مجاز است');
        reject('File size exceeds the allowed limit');
        return;
      }

      if (!this.isOnline) {
        this.ms.showErrorMessage('لطفا اتصال اینترنت را بررسی کنید');
        reject('No internet connection');
        return;
      }

      this.currentlySelectedFile = file;

      this.readFileAndShowPreview(file);

      this.uploading.set(true);
      this.uploadError.set(false);

      this.credit
        .uploadDocument(
          this.isInstallment(),
          file,
          this.creditWallet()?.creditId!,
          +this.creditWallet()!.fundProviderCode,
          this.step()!.stepTag,
          this.chequeOrder()!,
        )
        .subscribe({
          next: () => {
            this.uploading.set(false);
            this.uploadSuccess.emit(true);
            resolve(true);
          },
          error: (e) => {
            this.uploading.set(false);
            this.currentlySelectedFile = null;
            if (e && e.result && e.result.message) {
              this.ms.showErrorOfErrorResponse(e);
              reject(e.result.message);
            } else {
              if (!this.isOnline) {
                this.ms.showErrorMessage('لطفا اتصال اینترنت را بررسی کنید');
                reject('No internet connection');
              } else {
                this.ms.showErrorMessage('بروز خطا در هنگام بارگذاری فایل');
                reject('Error uploading file');
              }
            }
          },
        });
    });
  }

  /**
   * Retry upload
   * Deprecated: Since using ngx-uploader
   */
  retryUpload() {
    this.uploadFile(this.currentlySelectedFile!);
  }

  /**
   * Open uploaded image in a bottomsheet
   * Deprecated: Since using ngx-uploader
   */
  openImageDialog() {
    this.bottomSheetService.openBottomSheet(CreditImageDialogComponent, {
      imageId: this.step()?.stepResult,
      fileImageSrc: this.fileImageSrc(),
    });
  }

  /**
   * Check file size before uploading it
   *
   * Returns true when file size is smaller than the maximum upload size
   *
   * @param file
   */
  private checkFileSize(file: File) {
    const sizeInMb = file.size / 1024 / 1024;
    return sizeInMb < this.maxUploadSize()!;
  }

  /**
   * Show preview of the picked file
   *
   * @param file
   */
  private readFileAndShowPreview(file: File) {
    if (file && file.type.split('/')[0] === 'image') {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        this.fileImageSrc.set(this.sanitizer.bypassSecurityTrustUrl(base64));
      };
    } else {
      this.fileImageSrc.set(null);
    }
  }
}
