import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'wealth-applet-referral-code',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent, UiFormFieldBuilderModule, ReactiveFormsModule],
  templateUrl: './referral-code.component.html',
  styleUrl: './referral-code.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReferralCodeComponent {
  submitReferralCode = output<string>();
  extend = signal<boolean>(false);
  affiliate = new FormControl();

  onSubmit() {
    this.submitReferralCode.emit(this.affiliate.value);
  }
}
