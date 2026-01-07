import {
  Component,
  inject, OnDestroy,
  OnInit,
  signal,
  viewChild,
  ViewContainerRef
} from '@angular/core';
import {
  ActionButtonsComponent
} from '../../../../../../../../components/action-buttons/action-buttons.component';
import { ThirdPartyStepperComponent } from '../../../../components/third-party-stepper/third-party-stepper.component';
import {
  UiLoadingSpinnerComponent
} from '../../../../../../../../components/ui-loading-spinner/ui-loading-spinner.component';
import { VehicleSharedService } from '../../../../../../data-access/services/vehicle-shared.service';
import { DocumentApiService } from '../../../../../../data-access/services/third-party/document-api.service';
import { StoreService } from '../../../../data-access/services/store.service';
import { BaseComponent } from '../../../../../../../../components/base/base.component';
import { NgStyle } from '@angular/common';
import { UploadItemComponent } from './upload-item/upload-item.component';
import { InsButtonComponent } from '../../../../../../../../components/ins-button/ins-button.component';
import { InsButtonModeEnum } from '../../../../../../../../data-access/enums/ins-button-mode.enum';
import { InsButtonStyleEnum } from '../../../../../../../../data-access/enums/ins-button-style.enum';
import { InsButtonSizeEnum } from '../../../../../../../../data-access/enums/ins-button-size.enum';
import { UploadDocumentTypeEnum } from '../../data-access/enums/upload-document-type.enum';
import {
  UploadedDocumentModel
} from '../../../../../../data-access/models/third-party/upload-document/uploaded-document.model';
import { BehaviorSubject, Subscription } from 'rxjs';
import {
  UploadDocumentSettingsResponse
} from '../../../../../../data-access/models/third-party/upload-document/upload-document-settings.response';
import { InsuranceUrlsEnum } from '../../../../../../../../data-access/enums/insurance-urls.enum';
import { InsuranceKeysEnum } from '../../../../../../../../data-access/enums/insurance-keys.enum';
import { DocumentStateEnum } from '../../../../../../../../components/ui-upload-image/ui-upload-image.enum';
import { CloseService } from '../../../../../../data-access/services/shared/close.service';
import { InsuranceTabEnum } from '../../../../../../../policy/data-access/enums/policy-list.enum';
import { InsuranceProductTypeEnum } from '../../../../../../../../data-access/enums/Insurance-product-type.enum';

@Component({
  selector: 'additional-upload-document',
  standalone: true,
  imports: [
    ActionButtonsComponent,
    ThirdPartyStepperComponent,
    UiLoadingSpinnerComponent,
    NgStyle,
    InsButtonComponent
  ],
  templateUrl: './additional-upload-document.component.html',
  styleUrl: './additional-upload-document.component.scss'
})
export class AdditionalUploadDocumentComponent extends BaseComponent implements OnInit, OnDestroy {
  protected readonly InsButtonModeEnum = InsButtonModeEnum;
  protected readonly InsButtonStyleEnum = InsButtonStyleEnum;
  protected readonly InsButtonSizeEnum = InsButtonSizeEnum;

  private readonly ADDITIONAL_FILE_NAME: string = 'other-';
  private sharedService = inject(VehicleSharedService);
  private documentApiService = inject(DocumentApiService);
  private closeService = inject(CloseService);
  public storeService = inject(StoreService);
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
    const component = this.uploadContainer().createComponent(UploadItemComponent);
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
    this.documentApiService.checkOrderDocumentsBeingUploaded(this.storeService.getFormId(), true).subscribe({
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
    this.documentApiService.getUploadedDocument(document.id).subscribe({
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
    this.sharedService.navigate(InsuranceUrlsEnum.PolicyDetail,
      {
        queryParams: {[InsuranceKeysEnum.POLICY_TYPE]: InsuranceTabEnum.THIRD_PARTY},
        baseUrl: false,
        queryParamsHandling: 'merge',
      }, InsuranceProductTypeEnum.ThirdParty);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    super.ngOnDestroy();
  }
}
