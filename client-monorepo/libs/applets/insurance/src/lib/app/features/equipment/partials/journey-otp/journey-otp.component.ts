import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DeviceInfoService, isDesktop, isMobileOrTablet, MessageService } from '@client-monorepo/common/utilities';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { convertNonEnglishDigits } from '@digipay/strings';
import { AuthService } from '../../../auth/service/auth.service';
import { LoginOtpComponent } from '../../../auth/partials/login-otp/login-otp.component';
import { SharedUserSourceService } from '../../../../data-access/services/user-services/shared-user-source.service';
import { LoginService } from '../../../../data-access/services/user-services/login.service';
import { UsedJourneyService } from '../../../../data-access/services/user-services/used-journey.service';

@Component({
  selector: 'journey-otp',
  templateUrl: './journey-otp.component.html',
  standalone: true,
  imports: [LoginOtpComponent],
  styleUrls: ['./journey-otp.component.scss'],
})
export class JourneyOtpComponent implements OnInit, OnDestroy {
  constructor() {}

  public data = inject<{ mobile: string }>(MAT_DIALOG_DATA);
  public sheetData = inject<{ mobile: string }>(MAT_BOTTOM_SHEET_DATA);
  private sheetRef = inject(MatBottomSheetRef);
  private dialogRef = inject(MatDialogRef<JourneyOtpComponent>);
  private messageService = inject(MessageService);
  private authService = inject(AuthService);
  private loginService = inject(LoginService);
  private usedJourneyService = inject(UsedJourneyService);
  private sharedUserSourceService = inject(SharedUserSourceService);
  private deviceInfoService = inject(DeviceInfoService);

  // Subscriptions
  subscriptions: Subscription[] = [];

  // Vars
  phoneNumber = '';
  isMobile = isMobileOrTablet() || !isDesktop();

  ngOnInit(): void {
    this.phoneNumber = this.isMobile ? this.sheetData.mobile : this.data.mobile;
    this.afterLogin();
    this.sendOtpCode().then();
  }

  async sendOtpCode(): Promise<void> {
    this.sharedUserSourceService.globalCellNumber.next(this.phoneNumber);
    const device = await this.deviceInfoService.getDeviceInfo();
    const subscription = this.authService
      .getOTP({
        cellNumber: convertNonEnglishDigits(this.phoneNumber),
        device,
        userId: this.usedJourneyService.getJourneyUserId() ? this.usedJourneyService.getJourneyUserId() : null,
      })
      .subscribe({
        next: (res) => {
          this.usedJourneyService.saveJourneyUserId(res.userId);
          this.sharedUserSourceService.globalUserId.next(res.userId);
          this.messageService.showInfoMessage('پیامک ارسال شده را در این قسمت وارد کنید');
        },
        error: (err) => {
          this.messageService.showErrorIfExists(err);
        },
      });
    this.subscriptions.push(subscription);
  }

  afterLogin(): void {
    const subscription = this.loginService.isLoggedIn$.subscribe({
      next: (isLoggedIn) => {
        if (isLoggedIn) {
          this.closeDialog(true);
        }
      },
    });
    this.subscriptions.push(subscription);
    const subscriptionTwo = this.sharedUserSourceService.userHasPassword.asObservable().subscribe((hasPassword) => {
      if (hasPassword) {
        this.closeDialog(false);
      }
    });
    this.subscriptions.push(subscriptionTwo);
  }

  closeDialog(isAccepted: boolean): void {
    const result = {
      isAccepted,
    };
    if (this.isMobile) {
      this.sheetRef?.dismiss(result);
    } else {
      this.dialogRef?.close(result);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s && s.unsubscribe());
  }
}
