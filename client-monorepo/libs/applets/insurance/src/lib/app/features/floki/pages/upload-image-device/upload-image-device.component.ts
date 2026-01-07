import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { Location } from '@angular/common';
import { FlokiHeaderComponent } from '../../ui-component/floki-header/floki-header.component';
import { NgxAlert } from '@digipay/ngx-alert';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { ActivatedRoute, Router } from '@angular/router';
import { ScreenGuideComponent } from './partial/screen-guide/screen-guide.component';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { UploadImageDeviceService } from './services/upload-image-device.service';
import { QueryParamsEnum } from '../../enums/query-params.enum';
import { DeviceTypeEnum } from './models/device-type.enum';
import { MatDialog } from '@angular/material/dialog';
import { FileModel } from '../../models/file.model';
import { FlokiRoutesEnum } from '../../enums/floki-routes.enum';
import { Blob } from 'node:buffer';
import { ApplicationFormService } from '../../services/application-form.service';
import { BaseComponent } from '../../../../components/base/base.component';
import { BottomSheetService } from '../../../../data-access/services/bottom-sheet.service';
import { MessageService } from '@client-monorepo/common/utilities';
import { BottomSheetBoxComponent } from '../../../../components/bottom-sheet-box/bottom-sheet-box.component';
import { InsuranceNoticeComponent } from '../../../../components/insurance-notice/insurance-notice.component';
import { InsButtonStyleEnum } from '../../../../data-access/enums/ins-button-style.enum';
import { IFileUpload, NgxUploaderComponent } from '@digipay/ngx-uploader';

@Component({
  selector: 'health-check',
  standalone: true,
  imports: [
    FlokiHeaderComponent,
    NgxAlert,
    NgxButtonComponent,
    ReactiveFormsModule,
    UiFormFieldBuilderModule,
    NgxUploaderComponent,
    MatSlideToggle,
  ],
  templateUrl: './upload-image-device.component.html',
  styleUrl: './upload-image-device.component.scss',
})
export class UploadImageDeviceComponent extends BaseComponent implements OnInit {
  router = inject(Router);
  location = inject(Location);
  uploadImageDeviceService = inject(UploadImageDeviceService);
  bottomSheetService = inject(BottomSheetService);
  applicationFormService = inject(ApplicationFormService);
  activatedRoute = inject(ActivatedRoute);
  messageService = inject(MessageService);
  form: FormGroup;
  formId = signal('');
  screenDeviceUrls = signal<{ [key in DeviceTypeEnum]?: string }>({});
  secondScreenFrontFile = signal<Partial<FileModel>>({});
  showSecondFrontFile = signal<boolean>(true);
  file = signal<Partial<File>>({
    lastModified: 0,
    name: '',
    size: 0,
  });

  imagePreviewUrls = signal<Map<string, { previewUrl: string | ArrayBuffer; name: string }>>(
    new Map([
      [DeviceTypeEnum.CellPhoneFrontImage, { previewUrl: '', name: '' }],
      [DeviceTypeEnum.SecondCellPhoneFrontImage, { previewUrl: '', name: '' }],
      [DeviceTypeEnum.CellPhoneBackImage, { previewUrl: '', name: '' }],
    ]),
  );
  protected readonly DeviceTypeEnum = DeviceTypeEnum;
  private dialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.readQueryParam();
    this.getApplicationFormData();
  }

  getApplicationFormData(): void {
    const subscription = this.applicationFormService.getDraftsWithInterceptor(this.formId()).subscribe({
      next: (res) => {
        this.setDocumentUrls(res.result.documents);
      },
      error: (e) => {},
    });
    super.addSubscription(subscription);
  }

  setDocumentUrls(documents: FileModel[]): void {
    documents.forEach((document) => {
      this.getDocumentUrl(document.documentName, document.documentType);
    });
  }

  getDocumentUrl(documentName: string, documentType: DeviceTypeEnum): void {
    const subscription = this.applicationFormService.getApplicationFormDocument(this.formId(), documentName).subscribe({
      next: (blob) => {
        this.convertToBase64(documentType, blob, documentName);
      },
      error: () => {},
    });
    super.addSubscription(subscription);
  }

  convertToBase64(documentType: DeviceTypeEnum, blob: any, documentName: string): void {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        this.imagePreviewUrls.update((urls) => {
          const updatedUrls = new Map(urls);
          updatedUrls.set(documentType, { previewUrl: reader.result, name: documentName });
          return updatedUrls;
        });
      }
    };
    reader.readAsDataURL(blob);
  }

  goToCompleteInfo(): void {
    this.location.back();
  }

  fileUploaded(file: IFileUpload, deviceTypeEnum: DeviceTypeEnum, isSecondFrontScreenDevice = false): any {
    const fileUploaded = file.file;
    const fd = new FormData();
    fd.append('File', fileUploaded);
    fd.append('DocumentType', deviceTypeEnum);
    file.state = 'uploading';
    this.convertFileToBase64(file.file, deviceTypeEnum);
    const subscription = this.uploadImageDeviceService.putApplicationDocument(fd, this.formId(), deviceTypeEnum).subscribe({
      next: (res) => {
        file.state = 'uploaded';
        this.cdr.detectChanges();
        this.getDocumentUrl(res.documentName, res.doumentType);
        if (isSecondFrontScreenDevice) {
          this.secondScreenFrontFile.set(res.result);
        }
      },
      error: (err) => {
        //  this.messageService.showErrorInFloki(err);
        file.state = 'error';
      },
    });
    this.addSubscription(subscription);
  }

  readQueryParam(): void {
    const formIdExistInSnapShot = this.activatedRoute.snapshot.queryParamMap.get(QueryParamsEnum.ApplicationId);
    this.formId.set(formIdExistInSnapShot);
  }

  clickAction(): void {
    this.bottomSheetService
      .open(
        BottomSheetBoxComponent,
        {
          component: ScreenGuideComponent,
          name: 'ScreenGuideBottomSheet',
        },
        { fullPage: true },
      )
      .afterDismissed();
  }

  getPolicy(): void {
    this.dialog
      .open(InsuranceNoticeComponent, {
        data: {
          title: 'هشدار!',
          text: 'توجه کنید تصاویر ثبت شده توسط شما ملاک رسیدگی درخواست شما برای جبران خسارات خواهند بود و در ادامه قابل تغییر نیستند.',
          activeButtonText: 'تایید',
          deActiveButtonText: 'بازگشت',
          mode: 'warning',
          activeButtonMode: InsButtonStyleEnum.Fill,
        },
      })
      .afterClosed()
      .subscribe({
        next: (res) => {
          if (res) {
            this.router
              .navigate([FlokiRoutesEnum.Floki, FlokiRoutesEnum.IssuedPolicy], {
                queryParams: {
                  [QueryParamsEnum.ApplicationId]: this.formId(),
                },
              })
              .then();
          }
        },
      });
  }

  toggleChange(ev: any): void {
    if (!ev.checked && this.secondScreenFrontFile().documentName) {
      this.showSecondFrontFile.set(false);
      this.deleteApplicationDocument(this.secondScreenFrontFile().documentName, true);
    }
  }

  deleteApplicationDocument(documentName: string, showSecondFrontFile = false): void {
    const subscription = this.uploadImageDeviceService.deleteApplicationDocument(documentName, this.formId()).subscribe({
      next: (blob: Blob) => {
        if (showSecondFrontFile) {
          this.showSecondFrontFile.set(true);
        }
      },
      error: (err) => {
        // this.messageService.showErrorInFloki(err);
      },
    });
    super.addSubscription(subscription);
  }

  private convertFileToBase64(file: any, documentType: DeviceTypeEnum): void {
    const reader = new FileReader();
    reader.onload = () => {
      const currentUrls = this.screenDeviceUrls();
      currentUrls[documentType] = reader.result as string;
      this.screenDeviceUrls.set(currentUrls);
    };
    reader.readAsDataURL(file);
  }
}
