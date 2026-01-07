import { AfterViewInit, ChangeDetectionStrategy, Component, computed, inject, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@client-monorepo/common/user';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { LoginState, LoginStateService } from '@client-monorepo/applets/auth';
import { NgxFormValidator } from '@digipay/ngx-form-validator';
import { isIOsDevice, isMobileDevice, MessageService, StorageService } from '@client-monorepo/common/utilities';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { StoryCarouselComponent, StoryInterface } from '@client-monorepo/common/story-carousel';
import { ONBOARDING_STORIES } from '../../data-access/constants/onboarding-stories.constant';

@Component({
  selector: 'auth-applet-enter-phone-number',
  standalone: true,
  imports: [CommonModule, FormsModule, UiFormFieldBuilderModule, ReactiveFormsModule, NgxButtonComponent, StoryCarouselComponent],
  templateUrl: './enter-phone-number.component.html',
  styleUrl: './enter-phone-number.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterPhoneNumberComponent implements OnInit, AfterViewInit {
  form!: FormGroup;
  okReturned = output();
  LoginState = LoginState;

  authService = inject(AuthService);
  loginStateService = inject(LoginStateService);
  fb = inject(FormBuilder);
  messageService = inject(MessageService);
  storageService = inject(StorageService);

  onboardingStories = signal<StoryInterface[]>(ONBOARDING_STORIES);

  presentativeCode = computed(() => this.loginStateService.presentativeCode());
  isSumbitForm = signal(false);
  isViewReady = signal(false);

  ngOnInit(): void {
    this.form = this.fb.group({
      phoneNumber: ['', [NgxFormValidator.cellNumberValidator()]],
    });
    this.checkHasReferralParam();
    this.checkRetryMode();
  }

  ngAfterViewInit() {
    this.prepareFormRendering();
  }

  /**
   * Prevents iOS keyboard auto-focus by delaying input rendering
   */
  private prepareFormRendering(): void {
    if (!isIOsDevice() && !isMobileDevice()) {
      this.isViewReady.set(true);
      return;
    }
    // Ensures DOM has painted first
    requestAnimationFrame(() => {
      setTimeout(() => {
        this.isViewReady.set(true);
      }, 300);
    });
  }

  private checkRetryMode(): void {
    if (this.loginStateService.isRetry()) {
      this.loginStateService.isRetry.set(false);
    }
  }
  private checkHasReferralParam(): void {
    const routeValue = this.storageService.getBeforeLoginRoute();
    if (routeValue?.queryParams?.referralCode) {
      this.loginStateService.presentativeCode.set(routeValue.queryParams?.referralCode);
    }
  }

  get getPhoneNumberValue(): string {
    return this.form.get('phoneNumber')?.value;
  }

  async getCode(): Promise<void> {
    if (this.form.invalid) {
      return;
    }

    try {
      this.isSumbitForm.set(true);
      const sendSms$ = await this.authService.getCode(
        this.getPhoneNumberValue,
        this.presentativeCode() ? this.presentativeCode() : undefined,
      );

      sendSms$.subscribe({
        next: (res) => {
          this.loginStateService.phoneNumber.set(this.getPhoneNumberValue);
          this.loginStateService.userId.set(res?.userId);
          this.loginStateService.isAutofill.set(res?.autofill);
          this.okReturned.emit();
          this.isSumbitForm.set(false);
        },
        error: (error) => {
          this.isSumbitForm.set(false);
          if (error.status === 422 && error.error.result.status === 16002) {
            if (this.canProceedToOtp()) {
              this.loginStateService.isRetry.set(true);
              this.okReturned.emit();
              return;
            }
          }
          this.messageService.showErrorOfErrorResponse(error);
        },
      });
    } catch (error) {
      this.isSumbitForm.set(false);
      this.messageService.showErrorOfErrorResponse(error);
    }
  }

  private canProceedToOtp(): boolean {
    const userId = this.storageService.getUserId();
    const userPhoneNumber = this.getPhoneNumberValue;
    return !!(userId && userPhoneNumber === this.storageService.getUserData()?.phoneNumber);
  }

  goToStep(state: LoginState) {
    this.loginStateService.state.set(state);
  }

  checkKeyCode(event: KeyboardEvent) {
    if (event.code === 'Enter' || event.code === 'NumpadEnter') {
      this.getCode();
      return;
    }
  }
}
