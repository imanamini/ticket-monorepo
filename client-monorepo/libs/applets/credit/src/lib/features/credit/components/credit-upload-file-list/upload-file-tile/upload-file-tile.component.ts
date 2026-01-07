import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';
import { Step } from '../../../data-access/models/credit/activation/step.model';
import { CreditApiService } from '../../../data-access/services/credit-api.service';
import { CreditWallet } from '../../../data-access/models/credit/wallet/credit-wallet.model';
import { MessageService } from '../../../data-access/services/message.service';
import { Router } from '@angular/router';
import { CreditUrlService } from '../../../data-access/utils/url';
import { StepInfoRouteData } from '../../../wallet-activation/credit-upload/step-info/step-info-route-data.model';
import { CreditFilePickerComponent } from '../../credit-file-picker/credit-file-picker.component';
import { NetworkConnectionService } from '../../../data-access/services/network-connection.service';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';
import { CreditDigipayImageComponent } from '../../credit-digipay-image/credit-digipay-image.component';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-upload-file-tile',
  templateUrl: './upload-file-tile.component.html',
  styleUrls: ['./upload-file-tile.component.scss'],
  standalone: true,
  imports: [CreditDigipayImageComponent, NgxSpinnerModule, NgxIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadFileTileComponent {
  step = input<Step>();

  creditWallet = input<CreditWallet>();

  disabled = input(false);

  /**
   * Local data of the selected file (base64 string)
   */
  fileImageSrc = signal<any>(null);

  borderColor!: string;

  imageId = new FormControl('');

  uploading = signal(false);

  uploadError = signal(false);

  uploadSuccess = output<boolean>();

  maxUploadSize = input(0);

  currentlySelectedFile: File | null = null;

  /**
   * Check network status
   */
  isOnline = false;
  bottomSheetService = inject(NgxBottomSheetService);
  sanitizer = inject(DomSanitizer);
  credit = inject(CreditApiService);
  ms = inject(MessageService);
  router = inject(Router);
  creditUrlService = inject(CreditUrlService);
  networkConnectionService = inject(NetworkConnectionService);

  constructor() {
    this.networkConnectionService.onConnectionStatusChange().subscribe((isOnline) => {
      this.isOnline = isOnline;
    });
  }

  /**
   * Pick file again
   *
   * @param $event
   */
  pickAgain($event: any) {
    if (this.step()?.statusText !== 'COMPLETED') {
      this.fileChange($event);
    } else {
      $event.stopPropagation();
      $event.preventDefault();
    }
  }

  /**
   * Input file changed callback
   * @param $event
   */
  fileChange($event: any) {
    if ($event.target.files.length > 0) {
      const file = $event.target.files[0];
      $event.target.value = '';
      this.uploadFile(file);
    }
  }

  /**
   * Deprecated: Since there is only one option in the bottom sheet,
   * there is no need to show it any more.
   */
  pickFile() {
    this.bottomSheetService.openBottomSheet(CreditFilePickerComponent, {
      showDelete: false,
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
        }
      }
    });
  }

  /**
   * Upload file
   *
   * @param file
   */
  uploadFile(file: File) {
    const validTypes = ['image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      this.currentlySelectedFile = null;
      this.ms.showErrorMessage('فقط فایل‌های JPEG و PNG مجاز هستند');
      return;
    }

    if (!this.checkFileSize(file)) {
      this.currentlySelectedFile = null;
      this.ms.showErrorMessage('سایز فایل انتخاب شده بیش از حد مجاز است');
      return;
    }

    if (!this.isOnline) {
      this.ms.showErrorMessage('لطفا اتصال اینترنت را بررسی کنید');
      return;
    }

    this.currentlySelectedFile = file;

    this.readFileAndShowPreview(file);

    this.uploading.set(true);

    this.uploadError.set(false);

    this.credit
      .uploadCollateralChequeDocument(file, this.creditWallet()!.fundProviderCode, this.creditWallet()!.creditId, this.step()!.stepTag)
      .subscribe({
        next: () => {
          this.uploading.set(false);
          this.uploadSuccess.emit(true);
        },
        error: (e) => {
          this.uploading.set(false);
          this.currentlySelectedFile = null;
          if (e && e.result && e.result.message) {
            this.ms.showErrorOfErrorResponse(e);
          } else {
            if (!this.isOnline) {
              this.ms.showErrorMessage('لطفا اتصال اینترنت را بررسی کنید');
            } else {
              this.ms.showErrorMessage('بروز خطا در هنگام بارگذاری فایل');
            }
          }
        },
      });
  }

  /**
   * Retry upload
   */
  retryUpload() {
    this.uploadFile(this.currentlySelectedFile!);
  }

  /**
   * More info click
   */
  stepMoreInfoClick() {
    const prevState = window.history.state;
    prevState.shouldReload = true;
    this.router.navigateByUrl(this.creditUrlService.getInnerServicePath('/wallet/activation/step–info'), {
      state: {
        prevState,
        title: this.step()?.moreInfoText,
        relativeFileUrl: this.step()?.moreInfoUrl,
        buttonText: 'متوجه شدم',
        backUrl: this.creditUrlService.getInnerServicePath('/wallet/activation/upload'),
      } as StepInfoRouteData,
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
    return sizeInMb < this.maxUploadSize();
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
