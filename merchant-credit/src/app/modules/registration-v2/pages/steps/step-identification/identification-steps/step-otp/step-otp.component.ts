import { Component, OnInit } from '@angular/core';
import { StepBase } from '../../../step-base';
import { RegistrationService } from '../../../../../registration.service';
import {
  GetTicketDetailResponse
} from '../../../../../../../api/clients/registration/response-models/get-ticket-detail.response';
import { MessageService } from '../../../../../../../core/message.service';
import {
  VerifyOtpActionMap,
  VerifyOtpStatus
} from '../../../../../../../api/models/otp/verify-otp-status';
import { of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Component({
  selector: 'step-otp',
  templateUrl: './step-otp.component.html',
  styleUrls: ['./step-otp.component.scss']
})
export class StepOtpComponent extends StepBase implements OnInit {

  resendEnabled = false;

  countdownSeconds = 120;

  details!: GetTicketDetailResponse;

  code = '';

  cellNumber = '';

  canProceed = false;

  verifyingOtp = false;

  errorMessage = '';

  resendingOtp = false;

  constructor(
    private service: RegistrationService,
    private messageService: MessageService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.service.getTicketDetail().subscribe(details => {
      if (details) {
        this.details = details;
        this.cellNumber = details.registration.cellNumber;
      }
    });
  }

  onCountdownFinish(): void {
    this.resendEnabled = true;
  }

  alertErrorMessage(errorMessage: string): void {
    this.errorMessage = errorMessage;
    setTimeout(() => {
      this.errorMessage = '';
    }, 800);
  }

  sendOtpAgain() {
    if (this.resendingOtp) {
      return;
    }
    this.resendingOtp = true;
    this.service.resendOtp().then(() => {
      this.resendingOtp = false;
      this.resendEnabled = false;
      this.code = '';
    }).catch(e => {
      this.messageService.showErrorIfExists(e);
      this.resendingOtp = false;
    });
  }

  onCodeChange(code: string): void {
    this.code = code;
    if (code && code.length >= 5) {
      this.canProceed = true;
    }
  }

//CHECK
  proceed(): void {
    if (!(this.code && this.code.length >= 5) || this.verifyingOtp) {
      return;
    }
    this.verifyingOtp = true;

    this.service.verifyOtp(this.code).pipe(
      switchMap(res => {
        this.handleResponseOfVerification(res.status);
        this.verifyingOtp = false;
        return of(null);
      }),
      catchError(e => {
        this.verifyingOtp = false;
        this.alertErrorMessage(this.messageService.getMessageIfHasAny(e, 'کد وارد شده اشتباه است.'));
        this.messageService.showErrorIfExists(e);
        return of(null);
      })
    ).subscribe();
  }

  handleResponseOfVerification(statue: VerifyOtpStatus): void {
    const action = VerifyOtpActionMap[statue];
    switch (action.type) {
      case 'nextStep':
        this.nextStep.emit();
        break;
      case 'errorMessage':
        this.alertErrorMessage(action.message);
        break;
      case 'snack':
        this.messageService.showErrorMessage(action.message);
        break;
      case 'resend':
        this.alertErrorMessage(action.message);
        this.sendOtpAgain();
    }
  }
}
