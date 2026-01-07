import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { MessageService } from '@client-monorepo/common/utilities';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { buildPasswordConfig, PasswordMode, PasswordType } from '../password-flow.type';
import { passwordMatchValidatorFactory } from '../../../data-access/utils/password-match.validator';
import { OtpVerificationComponent } from '../../../components/otp-verification/otp-verification.component';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { PasswordFlowService } from '../../../data-access/services/password-flow.service';
import { VerificationService } from '../../../data-access/services/verification.service';
import { DigiCardSharedService } from '../../../data-access/services/digi-card-shared.service';
import { PasswordApiService } from '../../../data-access/services/password-api.service';

@Component({
  selector: 'digipay-card-applet-password-shell',
  standalone: true,
  imports: [CommonModule, PageLayoutComponent, FormsModule, ReactiveFormsModule, NgxButtonComponent, UiFormFieldBuilderModule],
  providers: [PasswordFlowService, VerificationService, DigiCardSharedService, PasswordApiService],
  templateUrl: './password-shell.component.html',
  styleUrl: './password-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordShellComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly bottomSheet = inject(NgxBottomSheetService);
  private readonly message = inject(MessageService);
  private cardPasswordService = inject(PasswordFlowService);

  loading = signal(false);

  mode = signal<PasswordMode>('change');
  type = signal<PasswordType>('pin');
  cardId = signal<string>('');

  config = computed(() => buildPasswordConfig(this.mode(), this.type()));

  form = signal<FormGroup>(this.createForm(buildPasswordConfig('change', 'pin')));

  ngOnInit(): void {
    this.resolveRouteState();
    this.form.set(this.createForm(this.config()));
  }

  isPasswordType(value: any): value is PasswordType {
    return value === 'pin' || value === 'static';
  }
  isPasswordMode(value: any): value is PasswordMode {
    return value === 'change' || value === 'forgot';
  }

  private resolveRouteState() {
    const modeParam = this.route.snapshot.paramMap.get('mode');
    const typeParam = this.route.snapshot.paramMap.get('type');

    const mode: PasswordMode = this.isPasswordMode(modeParam) ? modeParam : 'change';
    const type: PasswordType = this.isPasswordType(typeParam) ? typeParam : 'pin';

    this.mode.set(mode);
    this.type.set(type);
    this.cardId.set(this.route.snapshot.paramMap.get('id') ?? '');
  }

  private createForm(cfg: ReturnType<typeof buildPasswordConfig>) {
    const passValidators = [
      Validators.required,
      Validators.minLength(cfg.length),
      Validators.maxLength(cfg.length),
    ];

    const group: Record<string, FormControl<any>> = {};

    if (cfg.showCvv2) {
      group['cvv2'] = new FormControl<number | null>(null, [Validators.required, Validators.minLength(3), Validators.maxLength(4)]);
    }

    if (cfg.showOldPassword) {
      group['oldPassword'] = new FormControl<number | null>(null, passValidators);
    }

    group['newPassword'] = new FormControl<number | null>(null, passValidators);
    group['confirmedNewPassword'] = new FormControl<number | null>(null, passValidators);

    return new FormGroup(group, {
      validators: passwordMatchValidatorFactory('newPassword', 'confirmedNewPassword'),
    });
  }

  formGroup() {
    return this.form();
  }

  openOtpBottomSheet() {
    this.bottomSheet.openBottomSheet(
      OtpVerificationComponent,
      { title: 'احراز هویت', phoneNumber: '09123456789' }, 
      { disableClose: true },
    );
  }
  submitForm() {
    const fg = this.formGroup();
    const cfg = this.config();

    fg.markAllAsTouched();

    if (fg.invalid) {
      if (fg.hasError('passwordMismatch')) {
        this.message.showErrorMessage('رمز جدید و تکرار آن یکسان نیست.');
        return;
      }
      this.message.showErrorMessage('اطلاعات فرم معتبر نیست.');
      return;
    }

    this.loading.set(true);

    const payload = fg.getRawValue();
    const cardId = this.cardId();

    const request$ =
      this.mode() === 'forgot'
        ? this.cardPasswordService.forgotPassword$(payload, cardId, [8011, 8012])
        : this.cardPasswordService.changePassword(payload, cardId);

    request$.subscribe({
      next: (res) => {
        this.loading.set(false);
        this.message.showSuccessMessage(res?.message ?? 'Operation succeeded.');
      },
      error: (err) => {
        this.loading.set(false);
        this.message.showErrorMessage(err?.error?.result?.message ?? 'خطا رخ داد.');
      },
    });
  }
}
