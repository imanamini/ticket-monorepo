import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppWindow, StorageService } from '@client-monorepo/common/utilities';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { UiDynamicPassFieldComponent } from '@client-monorepo/common/ui-components';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { C2cStateService } from '../../data-access/services/c2c-state.service';
import { C2cMainService } from '../../data-access/services/c2c-main.service';
import moment from 'jalali-moment';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval, startWith, takeWhile } from 'rxjs';

declare const window: AppWindow;

interface DynamicPasswordState {
  gettingPassword: boolean;
  countdownSeconds: number | null;
  enableSendButton: boolean;
}

@Component({
  selector: 'c2c-applet-c2c-card-credentials-form',
  standalone: true,
  imports: [CommonModule, PipesModule, ApiImageModule, UiDynamicPassFieldComponent, UiFormFieldBuilderModule, ReactiveFormsModule],
  templateUrl: './c2c-card-credentials-form.component.html',
  styleUrls: ['./c2c-card-credentials-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class C2cCardCredentialsFormComponent implements OnInit, AfterViewInit, OnDestroy {
  // Services
  private readonly c2cStateService = inject(C2cStateService);
  private readonly formBuilder = inject(UntypedFormBuilder);
  private readonly ref = inject(ChangeDetectorRef);
  private readonly storageService = inject(StorageService);
  private readonly c2cMainService = inject(C2cMainService);
  private readonly destroyRef = inject(DestroyRef);

  // Form validation rules
  validationRules = {
    password: [Validators.required, Validators.minLength(5), Validators.maxLength(12)],
    cvv2: [Validators.required, Validators.minLength(3), Validators.maxLength(4)],
    expirationDate: [Validators.required],
    message: [Validators.maxLength(30)],
  };

  // Computed properties
  unifiedSourceCardData = computed(() => this.c2cStateService.unifiedSourceCardData());
  isReadyForOtp = computed(() => this.c2cStateService.isPaymentConfigLoaded());

  // Signals for auto-focus management
  autofocusDate = signal(false);
  autoFocusPassword = signal(false);

  // Dynamic password state
  dynamicPassword: DynamicPasswordState = {
    gettingPassword: false,
    countdownSeconds: null,
    enableSendButton: true,
  };

  // Form and timer
  form!: UntypedFormGroup;
  private interval: any;

  constructor() {
    this.initializeForm();
    this.setupCardDataEffect();
  }

  ngOnInit(): void {
    this.startPeriodicRefresh();
    this.checkTimeForDynamicPassword();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.setupFocusHandlers();
    }, 1);
  }

  ngOnDestroy(): void {
    this.cleanupInterval();
  }

  // Public methods
  public getForm(): UntypedFormGroup {
    return this.form;
  }

  sendDynamicPass(): void {
    this.setupHybridAppIntegration();
    this.resetPasswordFocus();
    this.updateDynamicPasswordState(true, false, null);
    this.requestDynamicPassword();
  }

  dynamicPassCountdownFinished(): void {
    this.dynamicPassword.countdownSeconds = null;
    this.dynamicPassword.enableSendButton = true;
  }

  // Private initialization methods
  private initializeForm(): void {
    this.form = this.formBuilder.group({
      password: ['', this.validationRules.password],
      cvv2: ['', this.validationRules.cvv2],
      expirationDate: ['', this.validationRules.expirationDate],
      message: ['', this.validationRules.message],
    });
  }

  private setupCardDataEffect(): void {
    effect(() => {
      const selectedCard = this.c2cStateService.unifiedSourceCardData();
      if (selectedCard) {
        this.updateExpirationDate(selectedCard.expireDate || '');
      }
    });
  }

  private updateExpirationDate(expireDate: string): void {
    const millis = moment(expireDate, 'jYYYY/jMM').locale('fa').toDate().getTime();
    this.form.controls['expirationDate'].patchValue(millis);
  }

  // Focus management methods

  private setupFocusHandlers(): void {
    this.setupCvv2FocusHandler();
    this.setupExpirationDateFocusHandler();
  }

  private setupCvv2FocusHandler(): void {
    this.form.controls['cvv2'].valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.resetAllFocus();
      if (this.form.controls['cvv2'].value.length === 4) {
        setTimeout(() => {
          this.focusNextFieldAfterCvv2();
        }, 500);
      }
    });
  }

  private setupExpirationDateFocusHandler(): void {
    this.form.controls['expirationDate'].valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      this.autoFocusPassword.set(false);
      if (value) {
        setTimeout(() => {
          this.autoFocusPassword.set(true);
        }, 10);
      }
    });
  }

  private resetAllFocus(): void {
    this.autoFocusPassword.set(false);
    this.autofocusDate.set(false);
  }

  private focusNextFieldAfterCvv2(): void {
    if (!this.form.controls['expirationDate'].value) {
      this.autofocusDate.set(true);
    } else {
      this.autoFocusPassword.set(true);
    }
  }

  private resetPasswordFocus(): void {
    this.autoFocusPassword.set(false);
    setTimeout(() => {
      this.autoFocusPassword.set(true);
    }, 10);
  }

  // Dynamic password methods
  private setupHybridAppIntegration(): void {
    if (window.digipayHybridApp && typeof window.digipayHybridApp.getDynamicPassword === 'function') {
      this.setHybridCode();
    }
  }

  private setHybridCode(): void {
    window.digipayHybridApp.setDynamicPassword = (code: string) => {
      this.form.get('password')?.setValue(code);
    };
    window.digipayHybridApp.getDynamicPassword();
  }

  private requestDynamicPassword(): void {
    interval(100)
      .pipe(
        startWith(0),
        takeWhile(() => !this.isReadyForOtp(), true),
      )
      .subscribe({
        next: () => {
          this.c2cMainService
            .sendDynamicPass()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: (res) => this.handleDynamicPasswordSuccess(res),
              error: () => this.handleDynamicPasswordError(),
            });
        },
      });
  }

  private handleDynamicPasswordSuccess(res: any): void {
    const duration = res.validityDuration / 1000;
    this.c2cMainService.storeDataForDynamicPassword(duration);
    this.updateDynamicPasswordState(false, false, duration);
  }

  private handleDynamicPasswordError(): void {
    this.updateDynamicPasswordState(false, true, null);
  }

  private updateDynamicPasswordState(gettingPassword: boolean, enableSendButton: boolean, countdownSeconds: number | null): void {
    this.dynamicPassword = {
      gettingPassword,
      enableSendButton,
      countdownSeconds,
    };
  }

  checkTimeForDynamicPassword(): void {
    const cardIndex = this.unifiedSourceCardData()?.cardIndex as PropertyKey;
    const data = this.storageService.getCardHistory();

    if (!data || !Object.prototype.hasOwnProperty.call(data, cardIndex)) {
      return;
    }

    const remainingTime = this.calculateRemainingTime(data[cardIndex]);

    if (remainingTime > 0) {
      this.updateDynamicPasswordState(false, false, remainingTime);
    } else {
      this.storageService.removeCardHistory(cardIndex);
    }
  }

  private calculateRemainingTime(cardData: any): number {
    const elapsedTime = (+new Date() - Number(cardData.startTime)) / 1000;
    return cardData.countdownSeconds - elapsedTime;
  }

  private startPeriodicRefresh(): void {
    this.interval = setInterval(() => {
      this.ref.markForCheck();
    }, 500);
  }

  private cleanupInterval(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
