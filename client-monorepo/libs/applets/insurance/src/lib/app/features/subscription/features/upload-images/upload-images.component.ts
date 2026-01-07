import { Component, inject, OnInit, signal } from '@angular/core';
import { UiUploadFileComponent } from '../../../../components/ui-upload-file/ui-upload-file.component';
import { MessageService } from '@client-monorepo/common/utilities';
import { MatDialog } from '@angular/material/dialog';
import { UploadStatesModel } from '../../../../components/ui-upload-file/model/upload-states.model';
import { HttpEventType } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { BaseComponent } from '../../../../components/base/base.component';
import { UploadPictureModel } from '../../../equipment/routes/used/steps/used-upload-file/model/upload-picture.model';
import { SubscriptionApiService } from '../../data-access/services/subscription-api.service';
import { SubscriptionUploadImageEnum } from '../../data-access/enums/subscription-upload-image.enum';
import { NgxSegmentedControlComponent } from '@digipay/ngx-segmented-control';
import { SegmentItemsModel } from '@digipay/ngx-segmented-control/lib/models/types';
import { SUBSCRIPTION_QUERY_PARAMS } from '../../data-access/constants/subscription-query-params';
import { JourneyButtonsComponent } from '../../../equipment/partials/journey-buttons/journey-buttons.component';
import { UsedInfoBoxComponent } from '../../../equipment/routes/used/partials/used-info-box/used-info-box.component';
import { Router } from '@angular/router';
import { SUBSCRIPTION_URLS } from '../../data-access/constants/subscription-urls';
import { SampleImagesComponent } from './components/sample-images/sample-images.component';
import {
  NoticeDialogDataModel
} from '../../../vehicle/features/third-party/components/notice-dialog/models/notice-dialog-data.model';
import {
  NoticeDialogComponent
} from '../../../vehicle/features/third-party/components/notice-dialog/notice-dialog.component';
import {
  NoticeDialogOutputModel
} from '../../../vehicle/features/third-party/components/notice-dialog/models/notice-dialog-output.model';

@Component({
  selector: 'upload-images',
  standalone: true,
  imports: [
    UiUploadFileComponent,
    NgxSegmentedControlComponent,
    JourneyButtonsComponent,
    UsedInfoBoxComponent,
    SampleImagesComponent
  ],
  templateUrl: './upload-images.component.html',
  styleUrl: './upload-images.component.scss'
})
export class UploadImagesComponent extends BaseComponent implements OnInit {

  protected readonly SubscriptionUploadImageEnum = SubscriptionUploadImageEnum;

  isLoading = signal<boolean>(true);
  options = signal<SegmentItemsModel[]>([
    {
      text: 'یک صفحه نمایش', id: 1, value: 'ONE_SCREEN',
    },
    {
      text: 'دو صفحه نمایش', id: 2, value: 'TWO_SCREEN',
    },
  ]);
  selectedOption = signal<SegmentItemsModel>(this.options()[0]);
  showHintImage = signal<boolean>(false);
  uniqueCode: string;

  isDisabledSwitchOptionChanges = false;

  files = new Map<number, { percent: number, mode: number, type: number, url: string, name: string }>([
    [UploadPictureModel.ImageFrontOne, {
      percent: 0,
      type: UploadPictureModel.ImageFrontOne,
      mode: UploadStatesModel.Initial,
      url: '',
      name: ''
    }],
    [UploadPictureModel.ImageFrontTwo, {
      percent: 0,
      type: UploadPictureModel.ImageFrontTwo,
      mode: UploadStatesModel.Initial,
      url: '',
      name: ''
    }],
    [UploadPictureModel.ImageBack, {
      percent: 0,
      type: UploadPictureModel.ImageBack,
      mode: UploadStatesModel.Initial,
      url: '',
      name: ''
    }],
  ]);

  private subscriptionApiService = inject(SubscriptionApiService);
  private messageService = inject(MessageService);
  private matDialog = inject(MatDialog);
  private router = inject(Router);

  ngOnInit(): void {
    this.getUniqueCode();
  }

  changeOption($event: SegmentItemsModel): void {
    if (!this.isDisabledSwitchOptionChanges) {
      if ($event.value === 'ONE_SCREEN' && this.files.get(UploadPictureModel.ImageFrontTwo).url.length > 0) {
        this.deleteFile(UploadPictureModel.ImageFrontTwo);
      }
      if (this.files.get(UploadPictureModel.ImageFrontOne).url.length > 0) {
        this.deleteFile(UploadPictureModel.ImageFrontOne);
      }
      this.selectedOption.set($event);
    }
    this.resetErrorDataWhenOptionChanged();
  }

  resetErrorDataWhenOptionChanged(): void {
    const hasFailedMode =
      Array.from(this.files.values()).some(value =>
        value.mode === UploadStatesModel.Failed);
    if (hasFailedMode) {
      this.files.forEach(value => {
        if (!value.url) {
          value.mode = UploadStatesModel.Initial;
        }
      });
    }
  }

  toggleSampleImages(): void {
    this.showHintImage.update(prev => !prev);
  }

  uploadFileHasError(key: number, ev: boolean): void {
    if (ev) {
      this.files.get(key).mode = UploadStatesModel.Failed;
    }
  }

  getUniqueCode(): void {
    this.uniqueCode = this.activatedRoute.snapshot.queryParams[SUBSCRIPTION_QUERY_PARAMS.POLICY_KEY];
  }

  selectedFile(file: File, pictureType: number): void {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('type', pictureType.toString());
    fd.append('key', this.uniqueCode);
    this.files.get(pictureType).mode = UploadStatesModel.Uploading;
    super.addSubscription(this.subscriptionApiService.uploadImage(fd).subscribe((event) => {
      if (event.type === HttpEventType.UploadProgress) {
        this.files.get(pictureType).percent = Math.round(event.loaded / event.total * 100);
      } else if (event.type === HttpEventType.Response) {
        this.files.get(pictureType).mode = UploadStatesModel.Success;
        this.files.get(pictureType).url = event.body.data.url;
      }
    }, (err: any) => {
      this.files.get(pictureType).mode = UploadStatesModel.Failed;
    }));
  }

  deleteFile(uploadState: number, twoScreenType ?: string): void {
    super.addSubscription(this.subscriptionApiService.deleteImage({
      type: uploadState,
      key: this.uniqueCode
    }).subscribe((res: any) => {
      this.files.get(uploadState).mode = UploadStatesModel.Initial;
      this.files.get(uploadState).percent = 0;
      this.files.get(uploadState).url = '';
    }));
  }

  submit(): void {
    const noticeData: NoticeDialogDataModel = {
      id: '1',
      title: 'هشدار',
      text: 'توجه کنید تصاویر ثبت شده شما، ملاک رسیدگی به خسارات و جبران آنها خواهند بود و در ادامه قابل تغییر نیستند.',
      actionBtnText: 'تایید',
      dismissBtnText: 'بازگشت'
    };
    this.matDialog.open(NoticeDialogComponent, {
      width: '90%',
      panelClass: 'notice-container',
      data: noticeData
    })
      .afterClosed()
      .subscribe({
        next: (data: NoticeDialogOutputModel) => {
          if (data?.isAccepted) {
            this.isLoading.set(true);
            const body = {
              key: this.uniqueCode,
              isImageFrontTwo: this.selectedOption().value === 'TWO_SCREEN'
            };
            super.addSubscription(this.subscriptionApiService.checkDocument(body)
              .pipe(
                finalize(() => this.isLoading.set(false)))
              .subscribe({
                next: (res) => {
                  this.messageService.showApiSuccess(res);
                  this.router.navigate([SUBSCRIPTION_URLS.HEALTH_CHECK], {
                    queryParamsHandling: 'preserve'
                  });
                },
                error: (e) => {
                  this.messageService.showErrorIfExists(e);
                }
              }));
          }
        }
      });
  }

  isFileUploaded(): boolean {
    const selectedOptionId = this.selectedOption();
    const frontOneUrl = this.files.get(UploadPictureModel.ImageFrontOne)?.url;
    const frontTwoUrl = this.files.get(UploadPictureModel.ImageFrontTwo)?.url;
    const backUrl = this.files.get(UploadPictureModel.ImageBack)?.url;

    if (selectedOptionId.value === 'ONE_SCREEN') {
      return !frontOneUrl || !backUrl;
    }

    if (selectedOptionId.value === 'TWO_SCREEN') {
      return !frontTwoUrl || !backUrl;
    }
    return false;
  }

  hiddenShowHintImage(): void {
    this.showHintImage.set(false);
    this.isDisabledSwitchOptionChanges = true;
  }
}
