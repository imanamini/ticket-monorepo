import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from '@client-monorepo/common/utilities';
import { SubscriptionApiService } from '../../data-access/services/subscription-api.service';
import { MatDialog } from '@angular/material/dialog';
import { SubscriptionModel } from '../../data-access/model/subscription.model';
import { finalize } from 'rxjs/operators';
import { convertNonEnglishDigits } from '@digipay/strings';
import { SubscriptionInfoModel } from '../../data-access/model/subscription-info.model';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';
import { BaseComponent } from '../../../../components/base/base.component';
import { SUBSCRIPTION_URLS } from '../../data-access/constants/subscription-urls';
import { InformationFormComponent } from '../../components/information-form/information-form.component';
import { InsuranceUrlsEnum } from '../../../../data-access/enums/insurance-urls.enum';
import { SubscriptionHeaderComponent } from '../../components/subscription-header/subscription-header.component';
import {
  NoticeDialogComponent
} from '../../../vehicle/features/third-party/components/notice-dialog/notice-dialog.component';
import {
  NoticeDialogOutputModel
} from '../../../vehicle/features/third-party/components/notice-dialog/models/notice-dialog-output.model';
import {
  NoticeDialogDataModel
} from '../../../vehicle/features/third-party/components/notice-dialog/models/notice-dialog-data.model';

@Component({
  selector: 'complete-info',
  standalone: true,
  imports: [
    NgxSpinnerModule,
    InformationFormComponent,
    SubscriptionHeaderComponent
  ],
  templateUrl: './complete-info.component.html',
  styleUrl: './complete-info.component.scss'
})
export class CompleteInfoComponent extends BaseComponent implements OnInit, OnDestroy {
  private messageService = inject(MessageService);
  private apiService = inject(SubscriptionApiService);
  private matDialog = inject(MatDialog);
  private router = inject(Router);

  private readonly ACTIVE_SUBSCRIPTION = 'فعال‌سازی بیمه';
  private readonly EXPORT_SUBSCRIPTION = 'صدور بیمه‌نامه';

  headerTitle = this.ACTIVE_SUBSCRIPTION;
  uniqueCode = '';
  subscriptionInfo: SubscriptionModel;
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.getOrderInfo();
  }

  getOrderInfo(): void {
    this.isLoading.set(true);
    this.uniqueCode = this.activatedRoute.snapshot.queryParams.code;
    if (!this.uniqueCode) {
      return;
    }
    super.addSubscription(this.apiService.getPolicyInfo(this.uniqueCode).pipe(
      finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (res) => {
          this.subscriptionInfo = res.data;
        },
        error: (e) => {
          this.messageService.showErrorIfExists(e);
        }
      }));
  }

  goToProfile(): void {
    this.router.navigate([InsuranceUrlsEnum.PolicyList]).then();
  }

  handleDataRegistered(formData: SubscriptionModel): void {
    const noticeData: NoticeDialogDataModel = {
      id: '1',
      title: 'هشدار',
      text: 'توجه کنید اطلاعات ثبت شده شما، ملاک رسیدگی به خسارات و جبران آنها خواهند بود و در ادامه قابل تغییر نیستند.',
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
            const body: SubscriptionInfoModel = {
              policyId: this.subscriptionInfo.policyId,
              firstName: formData.firstName.trim(),
              lastName: formData.lastName.trim(),
              mobile: convertNonEnglishDigits(formData.mobile.trim()),
              nationalCode: convertNonEnglishDigits(formData.nationalCode.trim()),
              serialNumber: convertNonEnglishDigits(formData.serialNumber.trim()),
              productBrand: formData.productBrand,
              productModel: formData.productModel,
              isActivated: true
            };
            super.addSubscription(this.apiService.setInformation(body).pipe(
              finalize(() => this.isLoading.set(false)))
              .subscribe({
                next: (res) => {
                  this.router.navigate([SUBSCRIPTION_URLS.UPLOAD_IMAGES], {
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
}
