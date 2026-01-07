import { Component, Inject, OnInit } from '@angular/core';
import { UiPinInputComponent } from '../ui-pin-input/ui-pin-input.component';
import { NgIf } from '@angular/common';
import { CountdownComponent, CountdownEvent } from 'ngx-countdown';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { TacService } from '../../../module/services/tac.service';
import { AuthClient } from '@digipay/ng-payment';
import { HybridService } from '../../services/web-interface/hybrid.service';
import { CellPhoneMaskPipe } from '../../pipes/cell-phone-mask.pipe';
import { OtpLength } from '../ui-pin-input/data-access/otp-length';
import { NgxButtonComponent } from '@digipay/ngx-button';

export interface CreditOtpBottomSheetData {
  userId: string;
  phone: string;
}

@Component({
  selector: 'app-credit-otp-bottom-sheet',
  standalone: true,
  imports: [
    UiPinInputComponent,
    NgIf,
    CountdownComponent,
    CellPhoneMaskPipe,
    NgxButtonComponent,
  ],
  templateUrl: './credit-otp-bottom-sheet.component.html',
  styleUrl: './credit-otp-bottom-sheet.component.scss'
})
export class CreditOtpBottomSheetComponent implements OnInit {
  userId: string;
  phone: string;
  waiting = true;
  otpError: boolean;
  isReadonly: boolean;
  autoFillOtpCode: string;
  otpInvalid: boolean;
  otpLoading: boolean;

  constructor(
    private ref: MatBottomSheetRef<CreditOtpBottomSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: CreditOtpBottomSheetData,
    private tacService: TacService,
    private hybridService: HybridService,
  ) {
    this.userId = data.userId;
    this.phone = data.phone;
    this.checkIsAutofillMode();
  }

  ngOnInit() {
    this.tacService.otpLoading.subscribe(r => this.otpLoading = r);
  }

  onPinChange($event: string) {
    if ($event.length === OtpLength) {
      this.verify($event);
    }
  }

  verify(otp: string) {
    this.tacService.verifyOtp(otp, this.userId).subscribe({
      next: _ => {
        this.ref.dismiss(true);
      },
      error: e => {
        this.otpError = true;
        this.otpInvalid = true;
        setTimeout(() => {
          this.otpError = false;
          this.otpInvalid = false;
          this.isReadonly = false;
        }, 1000);
      }
    });
  }

  callForOtpAgain() {
    this.tacService.callForOtp().subscribe(res => {
      if (res.userId) {
        this.userId = res.userId;
        this.waiting = true;
      }
    });
  }

  countdownHandler($event: CountdownEvent) {
    if ($event.action === 'done') {
      this.waiting = false;
    }
  }

  private checkIsAutofillMode(): void {
    if (AuthClient.isSupported()) {
      this.autoFillPin();
    }
  }

  private autoFillPin(): void {
    this.hybridService.setOtpCode().then(otp => {
      this.autoFillOtpCode = otp;
    });
  }
}
