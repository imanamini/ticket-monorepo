import { ChangeDetectionStrategy, Component, inject, input, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, UserZone } from '@client-monorepo/common/user';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { NgxFormValidator } from '@digipay/ngx-form-validator';
import { MessageService } from '@client-monorepo/common/utilities';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LoginState, LoginStateService } from '@client-monorepo/applets/auth';
import { map, take } from 'rxjs/operators';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { EscrowStorageService } from '@client-monorepo/escrow/utils';

@Component({
  selector: 'escrow-auth-applet-enter-phone-number',
  standalone: true,
  imports: [CommonModule, FormsModule, UiFormFieldBuilderModule, ReactiveFormsModule, RouterLink, NgxButtonComponent],
  templateUrl: './enter-phone-number.component.html',
  styleUrl: './enter-phone-number.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterPhoneNumberComponent implements OnInit {
  loginStateService = inject(LoginStateService);
  authService = inject(AuthService);
  storageService = inject(EscrowStorageService);
  messageService = inject(MessageService);
  route = inject(ActivatedRoute);
  fb = inject(FormBuilder);
  phoneNumber = signal('');
  zone = input<UserZone | undefined>(undefined);
  form!: FormGroup;
  okReturned = output();
  loginState = LoginState;

  ngOnInit(): void {
    this.listenToQueryParams();
    this.form = this.fb.group({
      phoneNumber: [this.phoneNumber(), [Validators.required, NgxFormValidator.cellNumberValidator()]],
    });
  }

  private listenToQueryParams(): void {
    this.route.queryParamMap
      .pipe(
        take(1),
        map((params) => ({
          phone: params.get('cellNumber'),
        })),
      )
      .subscribe(({ phone }) => {
        this.phoneNumber.set(phone ?? '');
        this.storageService.setEscrowCellNumber(phone);
      });
  }

  get getPhoneNumberValue(): string {
    return this.form.get('phoneNumber')?.value;
  }

  async getCode(): Promise<void> {
    if (this.form.invalid) {
      return;
    }
    const sendSms$ = await this.authService.getCode(this.getPhoneNumberValue, undefined, this.zone());
    sendSms$.subscribe({
      next: (res) => {
        this.loginStateService.phoneNumber.set(this.getPhoneNumberValue);
        this.loginStateService.userId.set(res.userId);
        this.loginStateService.isAutofill.set(res.autofill);
        this.okReturned.emit();
      },
      error: (error) => {
        this.messageService.showErrorOfErrorResponse(error);
      },
    });
  }

  goToStep(state: LoginState): void {
    this.loginStateService.state.set(state);
  }

  checkKeyCode(event: KeyboardEvent) {
    if (event.code === 'Enter' || event.code === 'NumpadEnter') {
      this.getCode();
      return;
    }
  }
}
