import { Component, effect, inject, input, OnChanges, output, signal, SimpleChanges, ViewChild } from '@angular/core';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgxWaitingStepperComponent, WaitingStepperStateEnum } from '@digipay/ngx-waiting-stepper';
import { NgClass } from '@angular/common';
import { timer } from 'rxjs';
import { SnackbarService } from '@digipay/ngx-snackbar';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { InsAlertComponent } from '../../../../../components/ins-alert/ins-alert.component';
import { BaseComponent } from '../../../../../components/base/base.component';
import { BnplExtraDetailModel } from '../../../data-access/models/third-party/order/bnpl-extra-detail.model';
import {
  VerifiedAllocationRequestModel
} from '../../../data-access/models/application-form/verified-allocations-request.model';
import { BottomSheetBoxComponent } from '../../../../../components/bottom-sheet-box/bottom-sheet-box.component';
import {
  BnplAllocationRequestGuideBottomSheetComponent
} from '../bnpl-allocation-request-guide-bottom-sheet/bnpl-allocation-request-guide-bottom-sheet.component';
import { StoreService } from '../../../features/third-party/data-access/services/store.service';
import { ApplicationFormApiService } from '../../../data-access/services/third-party/application-form-api.service';
import { BottomSheetService } from '../../../../../data-access/services/bottom-sheet.service';
import { AlertColorEnum } from '../../../../../data-access/enums/alert-color.enum';
import {
  VERIFY_BNPL_ALLOCATION_ERROR_ENUM_TRANSLATOR,
  VerifyBnplAllocationErrorEnum
} from '../../../data-access/enums/verify-bnpl-allocation-error.enum';
import { VerifyAllocationStateEnum } from '../../../data-access/enums/verify-allocation-state.enum';
import {
  MotorApplicationFormApiService
} from '../../../data-access/services/third-party-motor/motor-application-form-api.service';
import { MotorStoreService } from '../../../features/third-party-motor/data-access/services/motor-store.service';

@Component({
  selector: 'bnpl-payment-method-card',
  standalone: true,
  imports: [
    NgxButtonComponent,
    NgxIcon,
    NgxStatusResultModule,
    NgxWaitingStepperComponent,
    NgClass,
    InsAlertComponent
  ],
  templateUrl: './bnpl-payment-method-card.component.html',
  styleUrl: './bnpl-payment-method-card.component.scss'
})
export class BnplPaymentMethodCardComponent extends BaseComponent implements OnChanges {
  title = signal<string>('درخواست اعتبار آنی بیمه ‌دیجی‌پی');
  description = signal<string>('لطفاً چند لحظه منتظر بمانید.');
  bnplDetail = input.required<BnplExtraDetailModel>();
  isBanned = input.required<boolean>();
  productType = input.required<'car' | 'motor'>();
  userDetail = signal<VerifiedAllocationRequestModel>(null);
  verificationState = signal<VerifyAllocationStateEnum>(VerifyAllocationStateEnum.READY_TO_REQUEST_VERIFICATION);
  waitingStepperState = signal<WaitingStepperStateEnum>(WaitingStepperStateEnum.PROGRESS);
  waitingStepperProgress = signal<number>(0);
  descriptionMapper = signal<{ [key: string]: string }>({
    [VerifyBnplAllocationErrorEnum.PartyNationalCodeIsNotVerified]: 'کد ملی و تاریخ تولد واردشده با هم مطابقت ندارند و\n' +
      'متعلق به یک فرد نیست.برای دریافت اعتبار، \n' +
      'لطفاً اطلاعات صحیح را وارد کنید.',
    [VerifyBnplAllocationErrorEnum.PartyBirthDateIsNotVerified]: 'کد ملی و تاریخ تولد واردشده با هم مطابقت ندارند و\n' +
      'متعلق به یک فرد نیست.برای دریافت اعتبار، \n' +
      'لطفاً اطلاعات صحیح را وارد کنید.',
    [VerifyBnplAllocationErrorEnum.SmcScoreConfigFailed]: 'متأسفیم! در حال حاضر سرویس‌دهنده در دسترس نیست. لطفاً دوباره تلاش کنید.',
    [VerifyBnplAllocationErrorEnum.KycShahkarFailed]: 'متأسفیم! در حال حاضر سرویس‌دهنده در دسترس نیست. لطفاً دوباره تلاش کنید.'
  });
  snackTitleMessageMapper = signal<({ [key: string]: string })>({
    [VerifyAllocationStateEnum.VERIFYING]: 'در انتظار بررسی و  استعلام',
    [VerifyAllocationStateEnum.VERIFICATION_COMPLETED]: 'اعتبار آنی با موفقیت تأیید شد'
  });
  snackDescriptionMessageMapper = signal<({ [key: string]: string })>({
    [VerifyAllocationStateEnum.VERIFYING]: 'تا زمانی که نتیجه استعلام دریافت نشده است، \n' +
      'امکان انتخاب روش پرداخت دیگر و ادامه فرآیند \n' +
      'خرید وجود ندارد. لطفاً چند لحظه منتظر بمانید.',
    [VerifyAllocationStateEnum.VERIFICATION_COMPLETED]: 'امکان‌سنجی برای دریافت اعتبار بیمه دیجی‌پی با \n' +
      'موفقیت انجام شد.'
  });
  snackTypeMessageMapper = signal<({ [key: string]: 'success' | 'error' | 'warning' | 'info' })>({
    [VerifyAllocationStateEnum.VERIFYING]: 'warning',
    [VerifyAllocationStateEnum.VERIFICATION_COMPLETED]: 'success'
  });
  isVerifyingEmitter = output<boolean>();
  verifiedAllocationEmitter = output<boolean>();
  protected readonly VerifyAllocationStateEnum = VerifyAllocationStateEnum;
  protected readonly WaitingStepperStateEnum = WaitingStepperStateEnum;
  protected readonly AlertColorEnum = AlertColorEnum;
  @ViewChild(NgxWaitingStepperComponent) waitingStepperComponent: NgxWaitingStepperComponent;

  private bottomSheetService = inject(BottomSheetService);
  private applicationFormApiService: ApplicationFormApiService | MotorApplicationFormApiService;
  private storeService: StoreService | MotorStoreService;
  private snackBarService = inject(SnackbarService);

  private readonly carStoreService = inject(StoreService);
  private readonly motorStoreService = inject(MotorStoreService);
  private readonly carApplicationService = inject(ApplicationFormApiService);
  private readonly motorApplicationService = inject(MotorApplicationFormApiService);

  constructor() {
    super();
    effect(() => {
      if (this.productType()) {
        switch (this.productType()) {
          case 'car':
            this.applicationFormApiService = this.carApplicationService;
            this.storeService = this.carStoreService;
            break;
          case 'motor':
            this.applicationFormApiService = this.motorApplicationService;
            this.storeService = this.motorStoreService;
            break;
        }
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isBanned?.currentValue) {
      this.checkBannedStatus();
    }
  }

  checkBannedStatus(): void {
    if (this.isBanned()) {
      this.verificationState.set(VerifyAllocationStateEnum.BANNED);
      this.title.set('اعتبار ناکافی');
      this.description.set('اعتبار کافی برای انجام این پرداخت موجود نیست. حداقل موجودی اعتبار دیجی‌پی باید ۵٬۰۰۰٬۰۰۰ ریال باشد. لطفاً روش پرداخت دیگری را انتخاب کنید.');
    }
  }

  openBnplAllocationRequestBottomSheet(): void {
    super.addSubscription(
      this.bottomSheetService
        .open(BottomSheetBoxComponent, {
          component: BnplAllocationRequestGuideBottomSheetComponent,
          name: 'BnplAllocationRequestGuideBottomSheet',
          title: 'درخواست اعتبار آنی بیمه ‌دیجی‌پی',
        }).afterDismissed().subscribe({
        next: (value: VerifiedAllocationRequestModel) => {
          if (!value) {
            return;
          }
          this.waitingStepperComponent?.resetTimer();
          this.userDetail.set(value);
          this.verifyAllocation();
        }
      })
    );
  }

  verifyAllocation(): void {
    this.isVerifyingEmitter.emit(true);
    this.verificationState.set(VerifyAllocationStateEnum.VERIFYING);
    this.waitingStepperState.set(WaitingStepperStateEnum.PROGRESS);
    this.waitingStepperProgress.set(10);
    this.setProgressTimer();
    this.title.set('در حال بررسی و استعلام هستیم');
    this.description.set('لطفا چند لحظه منتظر بمانید.');
    super.addSubscription(
      this.applicationFormApiService.putVerifyAllocation(this.storeService.getFormId(), this.userDetail()).subscribe({
        next: response => {
          this.isVerifyingEmitter.emit(false);
          if (response.success) {
            this.verificationState.set(VerifyAllocationStateEnum.VERIFICATION_COMPLETED);
            this.showSnackMessage();
            this.verifiedAllocationEmitter.emit(true);
          }
        },
        error: err => {
          this.handleAllocationError(err.error.error.key);
          this.isVerifyingEmitter.emit(false);
        },
      })
    );
  }

  showSnackMessage(): void {
    if (!this.snackTitleMessageMapper()[this.verificationState()]) {
      return;
    }
    this.snackBarService.openSnackBar({
      message: this.snackTitleMessageMapper()[this.verificationState()],
      description: this.snackDescriptionMessageMapper()[this.verificationState()],
      status: this.snackTypeMessageMapper()[this.verificationState()],
      duration: 3000
    });
  }

  retryAllocation(): void {
    this.openBnplAllocationRequestBottomSheet();
  }

  handleAllocationError(errorKey: VerifyBnplAllocationErrorEnum): void {
    this.title.set(VERIFY_BNPL_ALLOCATION_ERROR_ENUM_TRANSLATOR[errorKey]);
    this.description.set(this.descriptionMapper()[errorKey]);
    this.verificationState.set(VerifyAllocationStateEnum.VERIFICATION_COMPLETED);
    this.waitingStepperProgress.set(100);
    this.waitingStepperState.set(WaitingStepperStateEnum.FAILED);
  }

  setProgressTimer(): void {
    timer(2000).subscribe(() => {
      if (this.waitingStepperState() === WaitingStepperStateEnum.PROGRESS) {
        this.waitingStepperProgress.set(70);
      }
    });
  }

}
