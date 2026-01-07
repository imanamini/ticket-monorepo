import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { NgxTouchKeyboardModule } from 'ngx-touch-keyboard';
import { PasswordInfo } from '../../../data-access/models/password-info.model';
import { PasswordStrength } from '../../../data-access/models/password-strength.model';
import { PasswordComplexityOutput } from '../../../data-access/models/password-complexity-output.model';

@Component({
  selector: 'app-password-input',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, UiFormFieldBuilderModule, NgxTouchKeyboardModule],
  templateUrl: './password-input.component.html',
  styleUrl: './password-input.component.scss',
})
export class PasswordInputComponent {
  @Input() inputPlaceholder = 'رمز عبور';
  @Input() displayIndicator = true;
  @Input() passwordInfo: PasswordInfo = {
    value: '',
    isPasswordVisible: false,
    passwordStrengthText: '',
    passwordStrengthColor: '',
    complexityLevel: 0,
    placeHolder: '',
    hasStrength: true,
    errorMessage: '',
    rules: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      symbol: false,
    },
  };
  @Output() onInputChanged = new EventEmitter<PasswordComplexityOutput>();

  togglePasswordVisibility() {
    this.passwordInfo.isPasswordVisible = !this.passwordInfo.isPasswordVisible;
  }

  checkPassRules(pass) {
    let isValid = true;
    const rules: PasswordStrength = {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      symbol: false,
    };
    if (pass.length >= 8) {
      rules.length = true;
      isValid = false;
    }
    if (/[a-z]/.test(pass)) {
      rules.lowercase = true;
      isValid = false;
    }
    if (/[A-Z]/.test(pass)) {
      rules.uppercase = true;
      isValid = false;
    }
    if (/\d/.test(pass)) {
      rules.number = true;
      isValid = false;
    }
    if (/[ !@#$%^&*()-+]/.test(pass)) {
      rules.symbol = true;
      isValid = false;
    }
    this.checkPassStrength(rules);
    this.passwordInfo.rules = rules;
    return isValid;
  }

  checkPassStrength(rules: PasswordStrength) {
    if (this.passwordInfo.value.length === 0) {
      this.passwordInfo.complexityLevel = 0;
      this.passwordInfo.isPasswordVisible = false;
      this.onInputChanged.emit({
        value: this.passwordInfo.value,
        complexity: 0,
        rules: Object.entries(this.passwordInfo.rules),
      });
      return;
    }
    const filteredObj = Object.keys(rules).reduce((acc, key) => {
      if (rules[key] === true && key !== 'length') {
        acc[key] = rules[key];
      }
      return acc;
    }, {});
    const validRulesCount = Object.keys(filteredObj).length;

    if (!rules.length || validRulesCount < 2) {
      this.passwordInfo.passwordStrengthText = 'ضعیف';
      this.passwordInfo.passwordStrengthColor = '#FF5C5C';
      this.passwordInfo.complexityLevel = 1;
    } else if (validRulesCount === 2) {
      this.passwordInfo.passwordStrengthText = 'متوسط';
      this.passwordInfo.passwordStrengthColor = '#FDAC42';
      this.passwordInfo.complexityLevel = 2;
    } else {
      this.passwordInfo.passwordStrengthText = 'قوی';
      this.passwordInfo.passwordStrengthColor = '#0ED039';
      this.passwordInfo.complexityLevel = 3;
    }
    this.onInputChanged.emit({
      value: this.passwordInfo.value,
      complexity: this.passwordInfo.complexityLevel,
      rules: Object.entries(this.passwordInfo?.rules),
    });
  }
}
