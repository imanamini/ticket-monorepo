import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayManagerService } from '@client-monorepo/common/ui-components';
import { ShowError, UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { NgxFormValidator } from '@digipay/ngx-form-validator';
import { CancelShahkarDialogComponent } from '../cancel-shahkar-dialog/cancel-shahkar-dialog.component';
import { AuthService, UserApiService } from '@client-monorepo/common/user';
import { MessageService, StorageService } from '@client-monorepo/common/utilities';
import { finalize, Subscription } from 'rxjs';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxEventTrackerService } from '@digipay/ngx-event-tracker';

@Component({
  selector: 'common-shahkar-register-shahkar',
  standalone: true,
  imports: [CommonModule, FormsModule, UiFormFieldBuilderModule, ReactiveFormsModule, CancelShahkarDialogComponent, NgxButtonComponent],
  templateUrl: './register-shahkar.component.html',
  styleUrl: './register-shahkar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterShahkarComponent implements OnInit, OnDestroy {
  isLoading = signal(false);
  showError = signal<ShowError>('auto');
  hasServerError = signal(false);
  isCanceling = signal(false);
  cancelable = computed<boolean>(() => {
    return this.overlayManagerService.data()?.cancelable;
  });
  overlayManagerService = inject(OverlayManagerService);
  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);
  userApiService = inject(UserApiService);
  messageService = inject(MessageService);
  private eventService = inject(NgxEventTrackerService);
  storageService = inject(StorageService);
  form!: FormGroup<{
    nationalCode: FormControl;
  }>;
  subscription!: Subscription;

  ngOnInit(): void {
    this.sendIntrackEvent('KYC_DAILY_FINTECH_INITIAL');
    this.form = this.formBuilder.group({
      nationalCode: ['', [NgxFormValidator.nationalCodeValidator(), this.serverErrorValidator().bind(this)]],
    });
    this.subscription = this.form.valueChanges.subscribe(() => {
      this.hasServerError.set(false);
    });
  }

  sendIntrackEvent(eventName: string): void {
    const userId = this.storageService.getUserId();
    this.eventService.sendEvent({ eventName, eventData: { userId } });
  }

  submitForm(): void {
    this.sendIntrackEvent('KYC_DAILY_FINTECH_SUBMIT_DATA');
    this.isLoading.set(true);
    this.userApiService
      .updateProfile(this.form.value)
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe({
        next: () => {
          this.sendIntrackEvent('KYC_DAILY_FINTECH_SUCCESS');
          this.overlayManagerService.closeOverlay(true);
        },
        error: (error) => {
          this.sendIntrackEvent('KYC_DAILY_FINTECH_ERROR');
          this.hasServerError.set(true);
          this.showError.set('show');
          this.form.get('nationalCode')?.updateValueAndValidity();
          setTimeout(() => {
            this.showError.set('auto');
          }, 100);
          if (error?.error?.result?.status === 1130) {
            this.sendIntrackEvent('KYC_DAILY_FINTECH_USER_BLOCKED');
            const attemptResetTime: number = error?.error?.attemptsResetTime;
            const description = `لطفا ${attemptResetTime} دقیقه دیگر دوباره امتحان کنید `;
            this.messageService.showErrorOfErrorResponse(error, '', description);
          }
        },
      });
  }

  handleCancelClick(): void {
    this.sendIntrackEvent('KYC_DAILY_FINTECH_CANCEL_BY_DELETE_PIN');
    this.isCanceling.set(!this.isCanceling());
  }

  handleDeletePin() {
    this.authService.deleteUserPassword().subscribe({
      next: () => {
        this.storageService.removePasswordData();
        this.overlayManagerService.closeOverlay(true);
      },
    });
  }

  serverErrorValidator(): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      return this.hasServerError() ? { serverError: true } : null;
    };
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
