import { Component, inject, signal, viewChild } from '@angular/core';
import {
  UploadedDocumentModel
} from '../../../../../../../data-access/models/third-party/upload-document/uploaded-document.model';
import { BehaviorSubject, of, Subject, takeUntil } from 'rxjs';
import {
  UiUploadImageComponent
} from '../../../../../../../../../components/ui-upload-image/ui-upload-image.component';
import { BaseComponent } from '../../../../../../../../../components/base/base.component';
import { DocumentApiService } from '../../../../../../../data-access/services/third-party/document-api.service';
import { HttpResponse } from '@angular/common/http';
import { StoreService } from '../../../../../data-access/services/store.service';
import {
  InsuranceNoticeComponent
} from '../../../../../../../../../components/insurance-notice/insurance-notice.component';
import { MatDialog } from '@angular/material/dialog';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'upload-item',
  standalone: true,
  imports: [
    UiUploadImageComponent
  ],
  templateUrl: './upload-item.component.html',
  styleUrl: './upload-item.component.scss'
})
export class UploadItemComponent extends BaseComponent {
  private documentApiService = inject(DocumentApiService);
  private storeService = inject(StoreService);
  private dialog = inject(MatDialog);

  maxFileSize = signal<number>(null);
  uploadedImageFile = signal<UploadedDocumentModel>(null);
  supportedOnlyAllFileTypes = signal<string>('');

  imageUploader = viewChild.required<UiUploadImageComponent>(UiUploadImageComponent);

  applicationFormId: string;
  uploadError = new BehaviorSubject(null);
  mandatoryInputs = new BehaviorSubject(null);
  cancelUploadRequestNotifier$ = new Subject<void>();

  public uploadDocument(docFile: File): void {
    this.uploadedImageFile.update(file => {
      file.fileType = docFile.type;
      file.file = docFile;
      return file;
    });
    super.addSubscription(this.documentApiService.uploadDocument(
      this.applicationFormId, this.uploadedImageFile(), docFile, this.uploadedImageFile().fileName, this.uploadedImageFile().type)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          this.uploadedImageFile.set({
            ...this.uploadedImageFile(),
            id: +response.headers.get('Document-Id'),
          });
          this.saveDocumentInStore(+response.headers.get('Document-Id'));
          this.imageUploader().uploadedImage.update(() => this.uploadedImageFile().file);
          this.imageUploader().initialize();
        }
      }));
  }

  uploadImage(docFile: File): void {
    if (this.uploadedImageFile()?.id) {
      super.addSubscription(
        this.documentApiService.removeUploadedDocument(this.uploadedImageFile().id)
          .pipe(
            takeUntil(this.cancelUploadRequestNotifier$),
            catchError((err) => {
              this.imageUploader().uploadedImage.update(() => this.uploadedImageFile().file);
              this.imageUploader().initialize();
              throw new Error(err);
            })
          )
          .subscribe({
            complete: () => {
              this.uploadDocument(docFile);
            }
          })
      );
    } else {
      this.uploadDocument(docFile);
    }
  }

  deleteImage(directDelete: boolean = false): void {
    if (directDelete) {
      this.removeUploadedDocument();
      return;
    }
    super.addSubscription(
      this.dialog.open(InsuranceNoticeComponent, {
        data: {
          title: 'حذف تصویر',
          text: 'آیا از حذف تصویر مطمئن هستید؟',
          activeButtonText: 'حذف',
          deActiveButtonText: 'بازگشت '
        },
        panelClass: 'notice-container'
      }).afterClosed().subscribe({
        next: value => {
          if (value) {
            this.removeUploadedDocument();
          }
        }
      })
    );
  }

  private removeUploadedDocument(): void {
    super.addSubscription(this.documentApiService.removeUploadedDocument(this.uploadedImageFile().id).subscribe({
      next: () => {
        this.uploadedImageFile.update(x => ({
          id: null,
          file: null,
          fileName: this.uploadedImageFile().fileName,
          title: this.uploadedImageFile().title,
          fileType: null,
          type: this.uploadedImageFile().type,
        }));
      }
    }));
  }

  public cancelUpload(): void {
    this.cancelUploadRequestNotifier$.next();
  }

  private saveDocumentInStore(id: number): void {
    this.storeService.setStoreData({
      ...this.storeService.appDataAsAppGetModel(),
      documents: [...this.storeService.appDataAsAppGetModel().documents, {
        id,
        type: this.uploadedImageFile().type,
        fileName: this.uploadedImageFile().fileName,
        title: this.uploadedImageFile().title
      }]
    });
  }
}
