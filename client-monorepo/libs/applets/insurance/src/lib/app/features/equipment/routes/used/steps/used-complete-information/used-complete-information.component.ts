import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { convertNonEnglishDigits } from '@digipay/strings';
import { finalize } from 'rxjs/operators';
import { Subscription, tap } from 'rxjs';
import { JourneyNamesModel } from '../../../../shared-steps/models/journey-names.model';
import { LoadingService } from '../../../../../../data-access/services/loading.service';
import { UsedApiService } from '../../../../api/services/used/used-api.service';
import { UsedHeaderButtonModes } from '../../partials/used-header/models/used-header-button.modes';
import { SharedUsedService } from '../../services/shared-used.service';
import { UsedPersonalInformationComponent } from './partials/used-personal-information/used-personal-information.component';
import { UsedImeiInformationComponent } from './partials/used-imei-information/used-imei-information.component';
import { NoticeDialogOutputModel } from '../../../../../vehicle/features/third-party/components/notice-dialog/models/notice-dialog-output.model';
import { NoticeDialogComponent } from '../../../../../vehicle/features/third-party/components/notice-dialog/notice-dialog.component';
import { NoticeDialogDataModel } from '../../../../../vehicle/features/third-party/components/notice-dialog/models/notice-dialog-data.model';
import { MatDialog } from '@angular/material/dialog';
import { OrderModel } from '../../../../api/models/renewal/order.model';
import { InformationBodyModel } from '../../../../api/models/used/information-body.model';
import { MessageService } from '@client-monorepo/common/utilities';

@Component({
  selector: 'used-complete-information',
  templateUrl: './used-complete-information.component.html',
  standalone: true,
  imports: [UsedPersonalInformationComponent, UsedImeiInformationComponent],
  styleUrls: ['./used-complete-information.component.scss'],
})
export class UsedCompleteInformationComponent implements OnInit, OnDestroy {
  constructor(
    private service: SharedUsedService,
    private loadingService: LoadingService,
    private messageService: MessageService,
    private apiService: UsedApiService,
    private matDialog: MatDialog,
  ) {}

  readonly JourneyNamesModel = JourneyNamesModel;
  showPersonalInfo = true;
  subscriptions: Subscription[] = [];
  userInfo: any;
  // showCompleteInformationResult = false;
  uniqueCode: string;
  orderInfo: OrderModel;

  @Output() hasError: EventEmitter<boolean> = new EventEmitter<boolean>();

  ngOnInit(): void {
    this.service.setJourney(JourneyNamesModel.USED_DEVICE);
    this.getUniqueCode();
    this.setHeaderData();
    this.subscribeToBackBtn();
  }

  subscribeToBackBtn(): void {
    this.subscriptions[1] = this.service.getBackClick().subscribe(() => {
      if (this.showPersonalInfo) {
        this.service.setStepChangeSubject('PREVIOUS');
      } else {
        this.showPersonalInfo = true;
      }
    });
  }

  getUniqueCode(): void {
    this.loadingService.setLoading(true);
    this.subscriptions[0] = this.service.getUniqueCode().subscribe({
      next: (code) => {
        if (code) {
          this.uniqueCode = code;
          this.getOrderInfo();
        }
      },
    });
  }

  getOrderInfo(): void {
    this.subscriptions[1] = this.apiService
      .getOrderInfo(this.uniqueCode)
      .pipe(tap(() => this.hasError.emit(false)))
      .subscribe({
        next: (res) => {
          this.orderInfo = res.data;
          this.service.setOrderInfo(this.orderInfo);
          this.loadingService.setLoading(false);
        },
        error: (err) => {
          this.hasError.emit(true);
        },
      });
  }

  personalInfoForm(ev: any): void {
    this.userInfo = ev;
    this.showPersonalInfo = false;
  }

  onRegister(value: any): void {
    const noticeData: NoticeDialogDataModel = {
      id: '1',
      title: 'هشدار',
      text: 'توجه کنید اطلاعات ثبت شده شما، ملاک رسیدگی به خسارات و جبران آنها خواهند بود و در ادامه قابل تغییر نیستند.',
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
            this.userInfo.imei = value.imei;
            const body: InformationBodyModel = {
              key: this.uniqueCode,
              firstName: this.userInfo.firstName.trim(),
              lastName: this.userInfo.lastName.trim(),
              customerMobile: convertNonEnglishDigits(this.userInfo.mobile.trim()),
              hasDifferentHolder: this.userInfo.hasDifferentHolder,
              nationalCode: convertNonEnglishDigits(this.userInfo.nationalCode.trim()),
              serial: convertNonEnglishDigits(this.userInfo.imei.trim()),
            };
            this.subscriptions[2] = this.apiService
              .setInformation(body)
              .pipe(finalize(() => this.loadingService.setLoading(false)))
              .subscribe({
                next: (res: any) => {
                  this.messageService.showApiSuccess(res);
                  this.service.setStepChangeSubject('NEXT');
                },
                error: (e) => {
                  this.messageService.showErrorIfExists(e);
                },
              });
          }
        },
      });
  }

  setHeaderData(): void {
    this.service.setHeaderData({
      showBackBtn: false,
      headerTitle: 'تکمیل اطلاعات',
      actionButtons: [{ mode: UsedHeaderButtonModes.PROFILE }],
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s && s.unsubscribe());
    this.loadingService.setLoading(false);
  }
}
