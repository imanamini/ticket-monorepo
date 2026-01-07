import {
  Component,
  inject, OnDestroy,
  OnInit,
  signal,
  viewChild,
  ViewContainerRef
} from '@angular/core';
import { NgStyle } from '@angular/common';
import { MotorUploadItemComponent } from './upload-item/motor-upload-item.component';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ThirdPartyMotorDirective } from '../../directives/third-party-motor.directive';
import { InsButtonModeEnum } from '../../../../../../data-access/enums/ins-button-mode.enum';
import { InsButtonStyleEnum } from '../../../../../../data-access/enums/ins-button-style.enum';
import { InsButtonSizeEnum } from '../../../../../../data-access/enums/ins-button-size.enum';
import { DocumentApiService } from '../../../../data-access/services/third-party/document-api.service';
import { DocumentStateEnum } from '../../../../../../components/ui-upload-image/ui-upload-image.enum';
import {
  UploadDocumentSettingsResponse
} from '../../../../data-access/models/third-party/upload-document/upload-document-settings.response';
import {
  UploadedDocumentModel
} from '../../../../data-access/models/third-party/upload-document/uploaded-document.model';
import {
  UploadDocumentTypeEnum
} from '../../../third-party/features/order/data-access/enums/upload-document-type.enum';
import { InsuranceUrlsEnum } from '../../../../../../data-access/enums/insurance-urls.enum';
import { InsuranceKeysEnum } from '../../../../../../data-access/enums/insurance-keys.enum';
import { InsuranceTabEnum } from '../../../../../policy/data-access/enums/policy-list.enum';
import { InsButtonComponent } from '../../../../../../components/ins-button/ins-button.component';
import { ActionButtonsComponent } from '../../../../../../components/action-buttons/action-buttons.component';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';
import { InsuranceProductTypeEnum } from '../../../../../../data-access/enums/Insurance-product-type.enum';

@Component({
  selector: 'motor-additional-upload-document',
  standalone: true,
  imports: [
    NgStyle,
    InsButtonComponent,
    ActionButtonsComponent,
    NgxSpinnerModule,
  ],
  templateUrl: './motor-additional-upload-document.component.html',
  styleUrl: './motor-additional-upload-document.component.scss'
})
export class MotorAdditionalUploadDocumentComponent extends ThirdPartyMotorDirective implements OnInit, OnDestroy {
  protected readonly InsButtonModeEnum = InsButtonModeEnum;
  protected readonly InsButtonStyleEnum = InsButtonStyleEnum;
  protected readonly InsButtonSizeEnum = InsButtonSizeEnum;

  private readonly ADDITIONAL_FILE_NAME: string = 'other-';
  private documentApiService = inject(DocumentApiService);
  private indexUploadComponent = 0;

  isLoaded = signal<boolean>(false);
  maxFileSize = signal<number>(null);
  supportedOnlyImageTypes = signal<string>('');
  supportedOnlyAllFileTypes = signal<string>('');
  uploadContainer = viewChild('upload_document_items_temp', {read: ViewContainerRef});

  private subscription: Subscription = new Subscription();

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.documentApiService.getUploadDocumentSettings().subscribe(setting => {
      this.getSettingUpload(setting.result);
      this.subscription = this.storeService.getStoreDataAsObservable().subscribe(data => {
        this.uploadContainer().clear();
        if (data) {
          const documentItems = data.documents.filter(z =>
            z.fileName.includes(this.ADDITIONAL_FILE_NAME) &&
            z.documentState === DocumentStateEnum.Uploaded);
          if (documentItems?.length === 0) {
            this.addUploadItem();
          } else {
            documentItems.forEach(item => this.getUploadedDocument(item));
          }
          this.subscription?.unsubscribe();
        }
        this.isLoaded.set(true);
      });
    });
  }

  private getSettingUpload(setting: UploadDocumentSettingsResponse): void {
    const supportedImageTypes = setting.supportedTypes.map(type => '.' + type);
    this.maxFileSize.set(setting.maxFileSizeAllowed);
    this.supportedOnlyImageTypes.set(supportedImageTypes.filter(type => !type.includes('pdf')).join(','));
    this.supportedOnlyAllFileTypes.set(supportedImageTypes.join(','));
  }

  addUploadItem(item?: UploadedDocumentModel): void {
    if (this.uploadContainer().length >= 5) {
      return;
    }
    const component = this.uploadContainer().createComponent(MotorUploadItemComponent);
    component.instance.uploadedImageFile = signal({
      fileName: item?.fileName ?? this.ADDITIONAL_FILE_NAME + this.indexUploadComponent++,
      fileType: item?.fileType ?? '',
      type: UploadDocumentTypeEnum.DocumentConflict,
      title: 'مدارک اضافه',
      id: item?.id ?? 0,
      filePath: '',
      file: item?.file ?? null,
      documentState: item?.documentState ?? null
    } as UploadedDocumentModel);
    component.instance.maxFileSize = this.maxFileSize;
    component.instance.supportedOnlyAllFileTypes = this.supportedOnlyAllFileTypes;
    component.instance.uploadError = new BehaviorSubject(false);
    component.instance.mandatoryInputs = new BehaviorSubject(false);
    component.instance.applicationFormId = this.storeService.getFormId();
    component.changeDetectorRef.detectChanges();
  }

  handleActiveButtonClicked(): void {
    this.motorApiService.checkOrderDocumentsBeingUploaded(this.storeService.getFormId(), true).subscribe({
      next: response => {
        if (response.result) {
          this.routeToPolicyDetail();
        }
      }
    });
  }

  handleDeActiveButtonClicked(): void {
    this.routeToPolicyDetail();
  }

  handleCloseClicked(): void {
    this.closeService.closeWithCheckQueryParam();
  }

  private getUploadedDocument(document: UploadedDocumentModel): void {
    if (document.documentState !== DocumentStateEnum.Uploaded) {
      return;
    }
    this.documentApiService.getUploadedDocument(document.id, 'Motor').subscribe({
      next: documentBlob => {
        this.addUploadItem({
          id: +documentBlob.headers.get('Document-Id'),
          file: new File([documentBlob.body], '', {type: 'application/octet-stream'}),
          fileName: document.fileName,
          fileType: document.fileType,
          title: document.title,
          type: document.type
        });
      }
    });
  }

  private routeToPolicyDetail(): void {
    this.vehicleSharedService.navigate(InsuranceUrlsEnum.PolicyDetail,
      {
        queryParams: {[InsuranceKeysEnum.POLICY_TYPE]: InsuranceTabEnum.THIRD_PARTY_MOTOR},
        baseUrl: false,
        queryParamsHandling: 'merge',
      }, InsuranceProductTypeEnum.ThirdPartyMotor);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    super.ngOnDestroy();
  }

  protected onClose(): void {
  }

  protected onNext(route: string): void {
  }
}
