import { Component, effect, ElementRef, input, output, signal, ViewChild, WritableSignal } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';
import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { UploadStatesModel } from './model/upload-states.model';
import { MatDialog } from '@angular/material/dialog';
import { PreviewComponent } from './partial/preview/preview.component';
import {
  NoticeDialogDataModel
} from '../../features/vehicle/features/third-party/components/notice-dialog/models/notice-dialog-data.model';
import {
  NoticeDialogComponent
} from '../../features/vehicle/features/third-party/components/notice-dialog/notice-dialog.component';
import {
  NoticeDialogOutputModel
} from '../../features/vehicle/features/third-party/components/notice-dialog/models/notice-dialog-output.model';


@Component({
  selector: 'ui-upload-file',
  standalone: true,
  imports: [
    MatProgressBar,
    NgTemplateOutlet,
    NgStyle,
    NgClass
  ],
  templateUrl: './ui-upload-file.component.html',
  styleUrl: './ui-upload-file.component.scss'
})
export class UiUploadFileComponent {
  @ViewChild('inputElement', {static: false}) fileInput: ElementRef;
  MAX_ERROR_SIZE = 'حداکثر حجم تصویر ۴ مگابایت';
  FORMAT_ERROR = 'فرمت داکیومنت صحیح نمی باشد';
  // SIGNALS
  uploadHasError: WritableSignal<{ text?: string, value: boolean }> =
    signal({text: this.MAX_ERROR_SIZE, value: false});
  fileUploaded = signal(undefined);
  // INPUT SIGNALS
  title = input.required<string>();
  percent = input.required<number>();
  url = input.required<string>();
  fileUploadedName = input.required<string>();
  textUploaded = input.required<string>();
  uploadType = input.required<UploadStatesModel>();
  // OUTPUT SIGNAL
  selectedFile = output<File>();
  deleteFile = output();
  componentHasError = output<boolean>();
  // ENUMS
  UploadStatesModel = UploadStatesModel;

  constructor(private dialog: MatDialog) {
    effect(() => {
      if (this.uploadType() === UploadStatesModel.Failed) {
        this.uploadHasError.update((res) => ({value: true, text: res.text}));
      } else {
        this.resetUploadErrors();
      }
    }, {allowSignalWrites: true});
  }

  fileSelected(event: Event): void {
    this.fileInput.nativeElement.disabled = true;
    setTimeout(() => {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        const file = new File([input.files[0]], input.files[0].name, {
          type: input.files[0].type,
          lastModified: Date.now()
        });
        this.validationForImageSize(file);
        if (!this.uploadHasError().value) {
          this.fileUploaded.set(file);
          this.selectedFile.emit(this.fileUploaded());
        }
        input.value = '';
        this.fileInput.nativeElement.disabled = false;
      }
    }, 1000);
  }

  deleteData(): void {
    this.fileInput.nativeElement.value = '';
    const noticeData: NoticeDialogDataModel = {
      id: '1',
      title: 'حذف تصویر',
      text: 'آیا از حذف تصویر مطمئن هستید؟',
      actionBtnText: 'حذف',
      dismissBtnText: 'بازگشت'
    };
    this.dialog.open(NoticeDialogComponent, {
      width: '90%',
      panelClass: 'notice-container',
      data: noticeData
    })
      .afterClosed()
      .subscribe({
        next: (data: NoticeDialogOutputModel) => {
          if (data?.isAccepted) {
            this.resetData();
          }
        }
      });
  }

  resetData(isUploadAgain?: boolean): void {
    this.fileUploaded.set(undefined);
    this.uploadHasError.set({value: false, text: ''});
    this.deleteFile.emit();
    if (isUploadAgain) {
      this.fileInput.nativeElement.click();
    }
  }

  validationForImageSize(file: File): void {
    if (file.size <= 4 * 1024 * 1024) {
      this.resetUploadErrors();
      this.componentHasError.emit(false);
    } else {
      this.uploadHasError.set({value: true, text: this.MAX_ERROR_SIZE});
      this.componentHasError.emit(true);
    }
    if (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg') {
      this.resetUploadErrors();
      this.componentHasError.emit(false);
    } else {
      this.uploadHasError.set({value: true, text: this.FORMAT_ERROR});
      this.componentHasError.emit(true);
    }
  }

  resetUploadErrors(): void {
    this.uploadHasError.set({value: false, text: this.MAX_ERROR_SIZE});
  }

  openPreviewDialog(): void {
    this.dialog.open(PreviewComponent, {
      data: {
        srcUrl: this.url()
      }
    });
  }
}


