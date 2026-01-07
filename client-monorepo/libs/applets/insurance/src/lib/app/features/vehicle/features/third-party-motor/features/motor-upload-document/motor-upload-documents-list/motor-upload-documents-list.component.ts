import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, Subject, takeUntil } from 'rxjs';
import {
  MotorUploadDocumentGuideBottomSheetComponent
} from '../upload-document-guide-bottom-sheet/motor-upload-document-guide-bottom-sheet.component';
import { catchError } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { KeyValuePipe } from '@angular/common';
import { NgxPlateComponent } from '@digipay/ngx-plate';
import { InsIconComponent } from '../../../../../components/ins-icon/ins-icon.component';
import {
  UiUploadImageComponent
} from '../../../../../../../components/ui-upload-image/ui-upload-image.component';
import { ThirdPartyMotorDirective } from '../../../directives/third-party-motor.directive';
import {
  UploadedDocumentModel
} from '../../../../../data-access/models/third-party/upload-document/uploaded-document.model';
import { IconEnum } from '../../../../../../../data-access/enums/icon.enum';
import { BottomSheetService } from '../../../../../../../data-access/services/bottom-sheet.service';
import { DocumentStateEnum } from '../../../../../../../components/ui-upload-image/ui-upload-image.enum';
import { MetricMatadataModel } from '../../../../../data-access/models/metric.model';
import {
  UploadDocumentSettingsResponse
} from '../../../../../data-access/models/third-party/upload-document/upload-document-settings.response';
import {
  BottomSheetBoxComponent
} from '../../../../../../../components/bottom-sheet-box/bottom-sheet-box.component';
import {
  InsuranceNoticeComponent
} from '../../../../../../../components/insurance-notice/insurance-notice.component';
import { MatDialog } from '@angular/material/dialog';
import { DocumentApiService } from '../../../../../data-access/services/third-party/document-api.service';

@Component({
  selector: 'motor-upload-documents-list',
  standalone: true,
  imports: [
    UiUploadImageComponent,
    InsIconComponent,
    KeyValuePipe,
    NgxPlateComponent,
    InsIconComponent,
    UiUploadImageComponent,
  ],
  templateUrl: './motor-upload-documents-list.component.html',
  styleUrl: './motor-upload-documents-list.component.scss'
})
export class MotorUploadDocumentsListComponent extends ThirdPartyMotorDirective implements OnInit {
  maxFileSize = signal<number>(null);
  supportedOnlyAllFileTypes = signal<string>('');
  uploadedImageFiles = signal<{ [key: string]: UploadedDocumentModel }>({});
  plate = signal<string | null>(null);

  cancelUploadRequestNotifier$: { [key: string]: Subject<void> } = {};
  mandatoryInputs: { [key: string]: BehaviorSubject<boolean> } = {};
  uploadErrors: { [key: string]: BehaviorSubject<boolean> } = {};

  documentsInitialized = output<boolean>();
  mandatoryInputsUploaded = output<boolean>();

  updateInputsValidationNotify = input<Observable<boolean>>(new Subject<boolean>());
  applicationFormId = input.required<string>({alias: 'application-form-id'});

  protected readonly IconEnum = IconEnum;
  protected readonly Object = Object;

  private readonly bottomSheetService = inject(BottomSheetService);
  private readonly dialog = inject(MatDialog);
  private readonly documentApiService = inject(DocumentApiService);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    super.addSubscription(forkJoin({
      requiredFiles: this.motorApiService.getRequiredFiles(this.applicationFormId()),
      setting: this.documentApiService.getUploadDocumentSettings()
    }).subscribe(({requiredFiles, setting}) => {
        this.getSettingUpload(setting.result);
        this.getApplicationRequiredFiles(requiredFiles.result);
        this.initializeComponentData();
      }
    ));
  }

  private getSettingUpload(setting: UploadDocumentSettingsResponse): void {
    this.maxFileSize.set(setting.maxFileSizeAllowed);
    const supportedImageTypes = setting.supportedTypes.map(type => '.' + type);
    this.supportedOnlyAllFileTypes.set(supportedImageTypes.join(','));
  }

  private getApplicationRequiredFiles(requiredFiles: UploadedDocumentModel[]): void {
    this.storeService.setStoreData({
      ...this.storeService.getStoreData(),
      requiredDocuments: requiredFiles
    });
    this.initializeUploadedImages(requiredFiles);
    this.loadUploadedDocuments();
  }

  initializeComponentData(): void {
    if (this.updateInputsValidationNotify()) {
      super.addSubscription(this.updateInputsValidationNotify().subscribe({
        next: () => {
          this.updateInputsValidation();
          this.mandatoryInputsUploaded.emit(this.areNeededImagesUploaded());
        }
      }));
    }
  }

  initializeUploadedImages(docs: UploadedDocumentModel[]): void {
    docs?.filter(doc => !doc.fileName?.includes('other')).forEach((doc: UploadedDocumentModel) => {
      this.uploadedImageFiles.update(x => ({
        ...x,
        [doc.fileName]: {
          id: doc.id,
          file: null,
          fileName: doc.fileName,
          title: doc.title,
          fileType: null,
          type: null,
          documentState: doc.documentState
        }
      }));
      this.mandatoryInputs[doc.fileName] = new BehaviorSubject<boolean>(false);
      this.uploadErrors[doc.fileName] = new BehaviorSubject<boolean>(false);
      this.cancelUploadRequestNotifier$[doc.fileName] = new Subject<void>();
    });
  }

  loadUploadedDocuments(): void {
    super.addSubscription(
      this.storeService.getStoreDataAsObservable().subscribe({
        next: response => {
          if (!response) {
            return;
          }
          this.plate.set(response.license);
          const uploadedDocs: UploadedDocumentModel[] = response.documents?.filter(doc =>
            doc.documentState === DocumentStateEnum.Uploaded) ?? [];
          this.documentsInitialized.emit(true);
          uploadedDocs.forEach(document => {
            this.documentApiService.getUploadedDocument(document.id, 'Motor').subscribe({
              next: documentBlob => {
                this.uploadedImageFiles.update(x => ({
                  ...x,
                  [document.fileName]: {
                    id: +documentBlob.headers.get('Document-Id'),
                    file: this.convertBlobToFile(documentBlob.body),
                    fileName: x[document.fileName].fileName,
                    fileType: document.fileType,
                    title: x[document.fileName].title,
                    type: x[document.fileName].type,
                    documentState: document.documentState
                  }
                }));
              }
            });
          });
        }
      })
    );
  }

  convertBlobToFile(fileBlob: Blob): File {
    return new File([fileBlob], '', {type: 'application/octet-stream'});
  }

  openGuideBottomSheet(): void {
    this.bottomSheetService
      .open(BottomSheetBoxComponent, {
        component: MotorUploadDocumentGuideBottomSheetComponent,
        name: 'UploadDocumentGuideBottomSheet',
        title: 'راهنمای تصاویر مدارک '
      });
  }

  deleteImage(doc: UploadedDocumentModel, directDelete: boolean = false): void {
    if (directDelete) {
      this.removeUploadedDocument(doc.fileName);
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
            this.removeUploadedDocument(doc.fileName);
          }
        }
      })
    );
  }

  removeUploadedDocument(fileName: string): void {
    super.addSubscription(this.documentApiService.removeUploadedDocument(this.uploadedImageFiles()[fileName].id, 'Motor').subscribe({
      next: () => {
        this.uploadedImageFiles.update(x => ({
          ...x,
          [fileName]: {
            id: this.uploadedImageFiles()[fileName].id,
            file: null,
            fileName: this.uploadedImageFiles()[fileName].fileName,
            title: this.uploadedImageFiles()[fileName].title,
            fileType: null,
            type: null,
            documentState: DocumentStateEnum.Removed
          }
        }));
        this.updateStoreServiceDocuments();
        this.mandatoryInputs[fileName].next(false);
      }
    }));
  }

  updateStoreServiceDocuments(): void {
    this.storeService.setStoreData({
      ...this.storeService.getStoreData(),
      documents: Object.values(this.uploadedImageFiles())
    });
  }

  uploadImage(applicationFormId: string, docFile: File, doc: UploadedDocumentModel): void {
    this.sendUploadMetric(applicationFormId, doc.fileName, Object.keys(this.uploadedImageFiles()).length);
    this.eraseUploadError(doc.fileName);
    if (this.isUploadedBefore(doc.fileName)) {
      super.addSubscription(
        this.documentApiService.removeUploadedDocument(this.uploadedImageFiles()[doc.fileName].id, 'Motor')
          .pipe(
            takeUntil(this.cancelUploadRequestNotifier$[doc.fileName]),
            catchError((err) => {
              throw new Error(err);
            })
          )
          .subscribe({
            complete: () => {
              this.uploadDocument(applicationFormId, docFile, doc);
            }
          })
      );
    } else {
      this.uploadDocument(applicationFormId, docFile, doc);
    }
  }

  sendUploadMetric(applicationId: string, filename: string, requiredDocumentsCount: number): void {
    const metadata: MetricMatadataModel[] = [
      {key: 'applicationId', value: applicationId},
      {key: 'fileName', value: filename},
      {key: 'requiredDocumentsCount', value: requiredDocumentsCount.toString()}
    ];
    this.metricService.sendMetric('UploadSingleDocument', null, metadata);
  }

  private uploadDocument(applicationFormId: string, docFile: File, doc: UploadedDocumentModel): void {
    this.documentApiService.uploadDocument(applicationFormId, doc, docFile, '', null, 'Motor')
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          this.uploadedImageFiles.update(x => ({
            ...x,
            [doc.fileName]: {
              id: +response.headers.get('Document-Id'),
              file: docFile,
              fileName: doc.fileName,
              title: doc.title,
              fileType: doc.fileType,
              type: doc.type,
              documentState: DocumentStateEnum.Uploaded
            }
          }));
          this.updateStoreServiceDocuments();
        },
        error: () => {
          this.handleUploadError(doc.fileName);
        }
      });
  }

  handleUploadError(fileName: string): void {
    this.uploadErrors[fileName].next(true);
  }

  isUploadedBefore(fileName: string): boolean {
    return !!this.uploadedImageFiles()[fileName].id && this.uploadedImageFiles()[fileName].documentState === DocumentStateEnum.Uploaded;
  }

  cancelImageUpload(fileName: string): void {
    this.cancelUploadRequestNotifier$[fileName].next();
  }

  eraseUploadError(fileName: string): void {
    this.mandatoryInputs[fileName].next(false);
    this.uploadErrors[fileName].next(false);
  }

  updateInputsValidation(): void {
    for (const key of Object.keys(this.uploadedImageFiles())) {
      this.mandatoryInputs[key]?.next(this.uploadedImageFiles()[key].documentState !== DocumentStateEnum.Uploaded);
    }
  }

  areNeededImagesUploaded(): boolean {
    return Object.keys(this.uploadedImageFiles()).every(key => this.uploadedImageFiles()[key].documentState === DocumentStateEnum.Uploaded);
  }

  protected onClose(): void {
    throw new Error('Method not implemented.');
  }

  protected onNext(route: string): void {
    throw new Error('Method not implemented.');
  }
}
