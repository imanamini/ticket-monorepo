import { Component, OnDestroy, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { UiSwitchComponent } from '../../../../../../components/ui-switch/ui-switch/ui-switch.component';
import { SwitchOption } from '../../../../../../components/ui-switch/models/switch-option.model';
import { SwitchService } from '../../../../../../components/ui-switch/service/switch.service';
import { UiUploadFileComponent } from '../../../../../../components/ui-upload-file/ui-upload-file.component';
import { UploadStatesModel } from '../../../../../../components/ui-upload-file/model/upload-states.model';
import { UsedInfoBoxComponent } from '../../partials/used-info-box/used-info-box.component';
import { MatDialog } from '@angular/material/dialog';
import { HintImagesComponent } from './partial/hint-images/hint-images.component';
import { JourneyButtonsComponent } from '../../../../partials/journey-buttons/journey-buttons.component';
import { UsedHeaderButtonModes } from '../../partials/used-header/models/used-header-button.modes';
import { SharedUsedService } from '../../services/shared-used.service';
import { Observable, Subscription } from 'rxjs';
import { UsedUploadService } from './service/used-upload.service';
import { UploadPictureModel } from './model/upload-picture.model';
import { LoadingService } from '../../../../../../data-access/services/loading.service';
import { HttpEventType } from '@angular/common/http';
import { UsedApiService } from '../../../../api/services/used/used-api.service';
import { finalize } from 'rxjs/operators';
import {
  UsedCompleteInformationResultComponent
} from '../used-complete-information-result/used-complete-information-result.component';
import { MessageService } from '@client-monorepo/common/utilities';
import { JourneyNamesModel } from '../../../../shared-steps/models/journey-names.model';
import {
  NoticeDialogDataModel
} from '../../../../../vehicle/features/third-party/components/notice-dialog/models/notice-dialog-data.model';
import {
  NoticeDialogComponent
} from '../../../../../vehicle/features/third-party/components/notice-dialog/notice-dialog.component';
import {
  NoticeDialogOutputModel
} from '../../../../../vehicle/features/third-party/components/notice-dialog/models/notice-dialog-output.model';
import { TabChangeModel } from './model/tab-change.model';
import { CheckDocumentModel } from '../../../../api/models/used/check-document.model';

@Component({
  selector: 'used-upload-file',
  standalone: true,
  imports: [
    UiSwitchComponent,
    UiUploadFileComponent,
    UsedInfoBoxComponent,
    JourneyButtonsComponent,
    UsedCompleteInformationResultComponent,
    HintImagesComponent,
  ],
  templateUrl: './used-upload-file.component.html',
  styleUrl: './used-upload-file.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class UsedUploadFileComponent implements OnInit, OnDestroy {
  constructor(
    private switchService: SwitchService,
    private service: SharedUsedService,
    private apiService: UsedApiService,
    private usedUploadService: UsedUploadService,
    private loadingService: LoadingService,
    private messageService: MessageService,
    private matDialog: MatDialog,
  ) {}

  // SIGNAL
  selectedOption = signal(this.switchService.getSelectedTabValue());
  // VARIABLES
  loading$: Observable<boolean> = this.loadingService.getLoading();
  operatorSwitchOptions: SwitchOption[] = [
    { id: 'ONE_SCREEN', text: 'یک صفحه نمایش' },
    { id: 'TWO_SCREEN', text: 'دو صفحه نمایش' },
  ];
  showCompleteInformationResult = false;
  showHintImage = false;
  uniqueCode: string;

  // ENUMS
  JourneyNamesModel = JourneyNamesModel;
  UploadPictureModel = UploadPictureModel;

  // Subscription
  subscriptions: Subscription[] = [];

  isDisabledSwitchOptionChanges = true;

  files = new Map<number, { percent: number; mode: number; type: number; url: string; name: string }>([
    [
      UploadPictureModel.ImageFrontOne,
      {
        percent: 0,
        type: UploadPictureModel.ImageFrontOne,
        mode: UploadStatesModel.Initial,
        url: '',
        name: '',
      },
    ],
    [
      UploadPictureModel.ImageFrontTwo,
      {
        percent: 0,
        type: UploadPictureModel.ImageFrontTwo,
        mode: UploadStatesModel.Initial,
        url: '',
        name: '',
      },
    ],
    [
      UploadPictureModel.ImageBack,
      {
        percent: 0,
        type: UploadPictureModel.ImageBack,
        mode: UploadStatesModel.Initial,
        url: '',
        name: '',
      },
    ],
  ]);

  ngOnInit(): void {
    this.setHeaderData();
    this.getUniqueCode();
  }

  changeOption(ev: SwitchOption): void {
    if (!this.isDisabledSwitchOptionChanges) {
      const tab = ev.id === 'ONE_SCREEN' ? TabChangeModel.OneScreen : TabChangeModel.TwoScreen;
      this.usedUploadService.setTabFromServer({ tab, key: this.uniqueCode }).subscribe((res) => {
        if (ev.id === 'ONE_SCREEN' && this.files.get(UploadPictureModel.ImageFrontTwo).url.length > 0) {
          this.deleteFile(UploadPictureModel.ImageFrontTwo);
        }
        if (this.files.get(UploadPictureModel.ImageFrontOne).url.length > 0) {
          this.deleteFile(UploadPictureModel.ImageFrontOne);
        }
      });
      this.selectedOption.set(ev);
    }
    this.resetErrorDataWhenOptionChanged();
  }

  resetErrorDataWhenOptionChanged(): void {
    const hasFailedMode = Array.from(this.files.values()).some((value) => value.mode === UploadStatesModel.Failed);
    if (hasFailedMode) {
      this.files.forEach((value) => {
        if (!value.url) {
          value.mode = UploadStatesModel.Initial;
        }
      });
    }
  }

  handleFooterClicked(): void {
    this.showHintImage = true;
  }

  uploadFileHasError(key: number, ev: boolean): void {
    if (ev) {
      this.files.get(key).mode = UploadStatesModel.Failed;
    }
  }

  setHeaderData(): void {
    this.service.setHeaderData({
      showBackBtn: false,
      headerTitle: 'بارگذاری تصاویر',
      actionButtons: [{ mode: UsedHeaderButtonModes.PROFILE }],
    });
  }

  getUniqueCode(): void {
    this.loadingService.setLoading(true);
    this.service.getUniqueCode().subscribe({
      next: (code) => {
        if (code) {
          this.uniqueCode = code;
          this.getOrderInfo();
        }
        this.loadingService.setLoading(false);
      },
    });
  }

  getOrderInfo(): void {
    const subscription = this.apiService.getOrderInfo(this.uniqueCode).subscribe({
      next: (res) => {
        this.setUploadedFile(res.data.deviceDocuments);
        if (res.data.phoneType === TabChangeModel.TwoScreen) {
          this.selectedOption.set(this.operatorSwitchOptions[1]);
          this.switchService.setSelectedTab(this.operatorSwitchOptions[1]);
        } else {
          this.selectedOption.set(this.operatorSwitchOptions[0]);
          this.switchService.setSelectedTab(this.operatorSwitchOptions[0]);
        }
        this.loadingService.setLoading(false);
      },
      error: (e) => {
        this.messageService.showErrorIfExists(e);
      },
      complete: () => {
        this.isDisabledSwitchOptionChanges = false;
      },
    });
    this.subscriptions.push(subscription);
  }

  setUploadedFile(documents: any): void {
    if (documents.length > 0) {
      documents.forEach((doc) => {
        this.files.get(doc.type).url = doc.url;
        this.files.get(doc.type).type = doc.type;
        this.files.get(doc.type).name = doc.fileName;
        this.files.get(doc.type).mode = UploadStatesModel.Success;
      });
    }
  }

  selectedFile(file: File, pictureType: number): void {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('type', pictureType.toString());
    fd.append('key', this.uniqueCode);
    this.files.get(pictureType).mode = UploadStatesModel.Uploading;
    const subscription = this.usedUploadService.uploadDocument(fd).subscribe(
      (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.files.get(pictureType).percent = Math.round((event.loaded / event.total) * 100);
        } else if (event.type === HttpEventType.Response) {
          this.files.get(pictureType).mode = UploadStatesModel.Success;
          this.files.get(pictureType).url = event.body.data.url;
        }
      },
      (err: any) => {
        this.files.get(pictureType).mode = UploadStatesModel.Failed;
      },
    );
    this.subscriptions.push(subscription);
  }

  deleteFile(uploadState: number, twoScreenType?: string): void {
    const subscription = this.usedUploadService
      .deleteDocument({
        type: uploadState,
        key: this.uniqueCode,
      })
      .subscribe((res: any) => {
        this.files.get(uploadState).mode = UploadStatesModel.Initial;
        this.files.get(uploadState).percent = 0;
        this.files.get(uploadState).url = '';
      });
    this.subscriptions.push(subscription);
  }

  submit(): void {
    const noticeData: NoticeDialogDataModel = {
      id: '1',
      title: 'هشدار',
      text: 'توجه کنید تصاویر ثبت شده شما، ملاک رسیدگی به خسارات و جبران آنها خواهند بود و در ادامه قابل تغییر نیستند.',
      actionBtnText: 'تایید',
      dismissBtnText: 'بازگشت',
    };
    this.matDialog
      .open(NoticeDialogComponent, {
        width: '90%',
        panelClass: 'notice-container',
        data: noticeData,
      })
      .afterClosed()
      .subscribe({
        next: (data: NoticeDialogOutputModel) => {
          if (data?.isAccepted) {
            this.loadingService.setLoading(true);
            const body: CheckDocumentModel = {
              key: this.uniqueCode,
              isImageFrontTwo: this.selectedOption()?.id === 'TWO_SCREEN',
            };
            const subscription = this.apiService
              .checkDocument(body)
              .pipe(finalize(() => this.loadingService.setLoading(false)))
              .subscribe({
                next: (res) => {
                  this.messageService.showApiSuccess(res);
                  this.service.setShowHeader(false);
                  this.showCompleteInformationResult = true;
                },
                error: (e) => {
                  this.messageService.showErrorIfExists(e);
                  this.showCompleteInformationResult = false;
                },
              });
            this.subscriptions.push(subscription);
          }
        },
      });
  }

  isFileUploaded(): boolean {
    const selectedOptionId = this.selectedOption()?.id;
    const frontOneUrl = this.files.get(UploadPictureModel.ImageFrontOne)?.url;
    const frontTwoUrl = this.files.get(UploadPictureModel.ImageFrontTwo)?.url;
    const backUrl = this.files.get(UploadPictureModel.ImageBack)?.url;

    if (selectedOptionId === 'ONE_SCREEN') {
      return !frontOneUrl || !backUrl;
    }

    if (selectedOptionId === 'TWO_SCREEN') {
      return !frontTwoUrl || !backUrl;
    }
    return false;
  }

  hiddenShowHintImage(): void {
    this.showHintImage = false;
    this.isDisabledSwitchOptionChanges = true;
    this.setHeaderData();
    this.getOrderInfo();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s && s.unsubscribe());
  }
}
