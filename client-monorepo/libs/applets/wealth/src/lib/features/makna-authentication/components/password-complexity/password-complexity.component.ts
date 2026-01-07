import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { PasswordInputComponent } from '../../../../shared/components/password-input/password-input.component';
import { PasswordComplexityOutput } from '../../../../data-access/models/password-complexity-output.model';
import { PasswordInfo } from '../../../../data-access/models/password-info.model';

@Component({
  selector: 'app-password-complexity',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, UiFormFieldBuilderModule, PasswordInputComponent],
  templateUrl: './password-complexity.component.html',
  styleUrl: './password-complexity.component.scss',
})
export class PasswordComplexityComponent {
  @Output() onPasswordChanged = new EventEmitter<PasswordComplexityOutput>();
  @Output() onRepeatPasswordChanged = new EventEmitter<PasswordComplexityOutput>();
  passwordInfo: PasswordInfo = {
    value: '',
    isPasswordVisible: false,
    passwordStrengthText: '',
    passwordStrengthColor: '',
    complexityLevel: 0,
    isPlaceHolderVisible: true,
    placeHolder: 'رمز عبور',
    hasStrength: true,
    rules: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      symbol: false,
    },
  };
  repeatPasswordInfo: PasswordInfo = {
    value: '',
    isPasswordVisible: false,
    passwordStrengthText: '',
    passwordStrengthColor: '',
    complexityLevel: 0,
    isPlaceHolderVisible: true,
    placeHolder: 'تکرار رمز عبور',
    hasStrength: true,
    rules: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      symbol: false,
    },
  };

  onPasswordValueChanged(value) {
    this.onPasswordChanged.emit(value);
  }

  onRepeatPasswordValueChanged(value) {
    this.onRepeatPasswordChanged.emit(value);
  }
}
