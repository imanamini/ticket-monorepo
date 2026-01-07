import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FillOtpComponent } from '@client-monorepo/common/otp';
import { ForgotPasswordStepEnum } from '../../data-access/models/forgot-password-step.enum';
import { ForgotPasswordService } from '../../data-access/services/forgot-password.service';
import { ForgotPasswordOutputModel } from '../../data-access/models/forgot-password-output.model';
import { Subscription } from 'rxjs';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { INTRACK_EVENT_OTP } from '../../data-access/consts/intrack-event';

@Component({
  selector: 'forgot-password-applet-otp',
  standalone: true,
  imports: [CommonModule, FillOtpComponent],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtpComponent implements OnInit, OnDestroy {
  nextStep = output<ForgotPasswordStepEnum>();
  forgotPasswordData = signal<ForgotPasswordOutputModel>({});
  forgotPasswordService = inject(ForgotPasswordService);
  bottomSheetService = inject(NgxBottomSheetService);
  bottomSheetData = computed(() => {
    return this.bottomSheetService.data();
  });
  dataSubscription = new Subscription();
  ngOnInit() {
    this.getForgotPasswordData();
    this.forgotPasswordService.setIntrackEvent(INTRACK_EVENT_OTP);
  }
  getForgotPasswordData() {
    this.dataSubscription = this.forgotPasswordService.forgotPassword.subscribe((data) => {
      this.forgotPasswordData.set(data);
    });
  }

  fillOtp(otp: string): void {
    this.forgotPasswordService.updateForgotPassword({
      otp: otp,
    });
    if (this.bottomSheetData()) {
      this.bottomSheetService.outputData.set(otp);
      this.bottomSheetService.closeBottomSheet();
      return;
    }
    this.nextStep.emit(ForgotPasswordStepEnum.PIN);
  }

  ngOnDestroy() {
    this.dataSubscription?.unsubscribe();
  }
}
