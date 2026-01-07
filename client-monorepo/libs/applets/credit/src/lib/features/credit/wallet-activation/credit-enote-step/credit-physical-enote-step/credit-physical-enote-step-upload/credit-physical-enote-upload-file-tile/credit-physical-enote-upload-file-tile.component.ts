import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';
import { Step } from '../../../../../data-access/models/credit/activation/step.model';
import { CreditApiService } from '../../../../../data-access/services/credit-api.service';
import { MessageService } from '../../../../../data-access/services/message.service';
import { NetworkConnectionService } from '../../../../../data-access/services/network-connection.service';
import { CreditFilePickerComponent } from '../../../../../components/credit-file-picker/credit-file-picker.component';
import { CreditImageDialogComponent } from '../../../../../components/credit-image-dialog/credit-image-dialog.component';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';
import { CreditDigipayImageComponent } from '../../../../../components/credit-digipay-image/credit-digipay-image.component';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-credit-physical-enote-upload-file-tile',
  templateUrl: './credit-physical-enote-upload-file-tile.component.html',
  styleUrls: ['./credit-physical-enote-upload-file-tile.component.scss'],
  standalone: true,
  imports: [NgxSpinnerModule, CreditDigipayImageComponent, NgxIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditPhysicalEnoteUploadFileTileComponent {
  step = input<Step>();
  title = input<string>();
  creditId = input.required<string>();
  disabled = input(false);
  chequeOrder = input<number>();
  maxUploadSize = input(0);

  uploadSuccess = output<boolean>();

  /**
   * Local data of the selected file (base64 string)
   */
  fileImageSrc = signal<any>(null);

  borderColor!: string;

  imageId = new FormControl('');

  uploading = signal(false);

  uploadError = signal(false);

  currentlySelectedFile: File | null = null;

  /**
   * Check network status
   */
  isOnline = false;

  file!: File;
  bottomSheetService = inject(NgxBottomSheetService);
  sanitizer = inject(DomSanitizer);
  credit = inject(CreditApiService);
  ms = inject(MessageService);
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
  pickAgain($event: Event) {
    if (this.step()?.statusText !== 'COMPLETED') {
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
      imageType: 'سفته',
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
  uploadFile(file: File): Promise<boolean> {
    return new Promise((resolve, reject) => {
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

      this.credit.uploadDocumentPhysicalNote(file, this.creditId()).subscribe({
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
   */
  retryUpload() {
    this.uploadFile(this.currentlySelectedFile!);
  }

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
