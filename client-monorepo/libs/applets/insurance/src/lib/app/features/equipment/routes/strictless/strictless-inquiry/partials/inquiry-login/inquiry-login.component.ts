import { Component, EventEmitter, Input, Output } from '@angular/core';

import { LoginOtpComponent } from '../../../../../../auth/partials/login-otp/login-otp.component';

@Component({
  selector: 'inquiry-login',
  templateUrl: './inquiry-login.component.html',
  styleUrls: ['./inquiry-login.component.scss'],
  imports: [
    LoginOtpComponent
  ],
  standalone: true
})
export class InquiryLoginComponent {

  @Input()
  mobileNo: string;

  @Input()
  userId: string;

  @Output()
  leggedIn = new EventEmitter();

  @Output()
  backToRegisterInquiry = new EventEmitter();

  @Output()
  sendSmsAgain = new EventEmitter();

  changeAction(): void {
    this.backToRegisterInquiry.emit();
  }
}
