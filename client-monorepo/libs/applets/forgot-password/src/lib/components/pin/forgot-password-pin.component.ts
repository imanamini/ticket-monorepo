import { ChangeDetectionStrategy, Component, inject, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotPasswordService } from '../../data-access/services/forgot-password.service';
import { ForgotPasswordStepEnum } from '../../data-access/models/forgot-password-step.enum';
import { PinLayoutComponent } from '@client-monorepo/common/pin';
import { INTRACK_EVENT_PIN } from '../../data-access/consts/intrack-event';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'forgot-password-applet-pin',
  standalone: true,
  imports: [CommonModule, PinLayoutComponent, NgxButtonComponent],
  templateUrl: './forgot-password-pin.component.html',
  styleUrl: './forgot-password-pin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordPinComponent implements OnInit {
  forgotPasswordService = inject(ForgotPasswordService);
  nextStep = output<ForgotPasswordStepEnum>();
  isDisableButton = signal(true);

  ngOnInit(): void {
    this.forgotPasswordService.setIntrackEvent(INTRACK_EVENT_PIN);
  }

  getUserPin(pin: string): void {
    this.isDisableButton.set(false);
    this.forgotPasswordService.updateForgotPassword({
      pin: pin,
    });
    this.nextStep.emit(ForgotPasswordStepEnum.NID);
  }

  onSubmitClicked() {
    this.nextStep.emit(ForgotPasswordStepEnum.NID);
  }
}
