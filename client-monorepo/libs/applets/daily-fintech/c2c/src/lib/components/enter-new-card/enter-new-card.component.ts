import { AfterViewInit, ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  Bank,
  BankCard,
  CardPreviewConfigInterface,
  CardProfile,
  CardZonesEnum,
  PreviewComponent,
} from '@client-monorepo/daily-fintech/bank-card';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { ShaparakService } from '../../data-access/services/shaparak.service';
import { getCardPanPrefix, MessageService } from '@client-monorepo/common/utilities';
import { CardRegistration } from '../../data-access/models/card-registration.enum';
import { ConfirmShaparakStatus } from '../../data-access/models/shaparak.model';
import { bankCardNumberValidator } from '../../data-access/validators/supported-card-number.validator';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { C2cStateService } from '../../data-access/services/c2c-state.service';
import { C2cCardManagementService } from '../../data-access/services/c2c-card-management.service';
import { C2cMainService } from '../../data-access/services/c2c-main.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, switchMap, throwError } from 'rxjs';
import { C2cCardHelper } from '../../utils/c2c-card';

@Component({
  selector: 'c2c-applet-enter-new-card',
  standalone: true,
  imports: [CommonModule, FormsModule, PreviewComponent, UiFormFieldBuilderModule, ReactiveFormsModule, NgxButtonComponent],
  templateUrl: './enter-new-card.component.html',
  styleUrls: ['./enter-new-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterNewCardComponent implements OnInit, AfterViewInit {
  // Injects
  private c2cStateService = inject(C2cStateService);
  private c2cCardManagementService = inject(C2cCardManagementService);
  private c2cMainService = inject(C2cMainService);
  private shaparakService = inject(ShaparakService);
  private formBuilder = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private messageService = inject(MessageService);

  // Outputs
  changeStep = output<void>();

  allBanks = computed<Bank[]>(() => this.c2cStateService.allBanks());
  cardData = signal<CardPreviewConfigInterface>({
    isSkeleton: true,
    width: '300px',
    classes: 'd-flex justify-content-center',
    maskCardNumber: false,
  });
  sourceCardNumber = signal('');
  errorServerMessage = signal(''); // TODO: Use this to show server error
  sourceCardProfile = signal<CardProfile | null>(null);

  form = signal<FormGroup>(this.createForm());

  bankName = signal('کارت بانکی');

  registerSpinner = signal(false);

  bank = signal<Bank | null>(null);

  ngOnInit() {
    this.checkValueChange();
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      sourceCardNumber: ['', [Validators.required, bankCardNumberValidator(this.allBanks(), 'SOURCE')]],
      cardExpMonth: ['', [Validators.required, Validators.min(1), Validators.max(12)]],
      cardExpYear: ['', [Validators.required, Validators.min(3), Validators.max(99)]],
      cardTitle: [''],
    });
  }
  private checkValueChange(): void {
    this.form()
      .valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((newValues) => {
        const cardNumber = newValues.sourceCardNumber;
        if (cardNumber && cardNumber !== this.cardData().cardNumber) {
          this.checkSourceCardInfo(cardNumber);
        }
        this.cardData.set({
          ...this.cardData(),
          cardNumber: this.cardData().cardNumber ?? cardNumber ?? '',
          expDate: newValues.cardExpYear && newValues.cardExpMonth ? this.fixDates(newValues.cardExpYear, newValues.cardExpMonth, '') : '',
        });
      });
  }

  private subscribeOnMonthChange(): void {
    const monthFormControl = this.form()?.controls['cardExpMonth'];
    monthFormControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((res: string | undefined | null) => {
      if (res && res.length === 2 && monthFormControl.valid) {
        const input = document.querySelector('#card-exp-year .dg-input-wrapper input') as HTMLElement;
        if (input) {
          input.focus();
        }
      }
    });
  }

  private subscribeOnCardChange(): void {
    const cardFormControl = this.form()?.controls['sourceCardNumber'];
    cardFormControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((res: string | undefined | null) => {
      if (res && res.length === 16 && cardFormControl.valid) {
        const input = document.querySelector('#card-exp-month .dg-input-wrapper input') as HTMLElement;
        if (input) {
          input.focus();
        }
      }
    });
  }

  private setupFocusHandlers(): void {
    this.subscribeOnMonthChange();
    this.subscribeOnCardChange();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      window.scrollTo({
        top: 0,
      });
    }, 0);
    this.setupFocusHandlers();
  }

  checkSourceCardInfo(card: string) {
    const sourceCardNumberWithoutDashes = C2cCardHelper.removePanDashes(card);
    this.cardData.set({
      ...this.cardData(),
      cardNumber: sourceCardNumberWithoutDashes,
    });
    const prefix = getCardPanPrefix(sourceCardNumberWithoutDashes);
    this.findBank(prefix);

    if (sourceCardNumberWithoutDashes.length < 16) {
      this.errorServerMessage.set('');
      this.sourceCardProfile.set(null);
      this.c2cStateService.sourceCardProfileData.set(null);
      this.cardData.set({
        ...this.cardData(),
        ownerName: '',
      });
    }

    this.sourceCardNumber.set(sourceCardNumberWithoutDashes);
    setTimeout(() => {
      if (sourceCardNumberWithoutDashes.length === 16) {
        this.getProfile(sourceCardNumberWithoutDashes);
      }
    }, 0);
  }

  getProfile(cardNumber: string): void {
    // Set loading
    this.cardData.set({
      ...this.cardData(),
      isSkeleton: true,
    });

    this.c2cMainService
      .loadCardProfile(cardNumber, this.bank())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          // Handle success - component specific logic
          this.sourceCardProfile.set(result);
          this.c2cStateService.sourceCardProfileData.set(result);
          this.errorServerMessage.set('');
          this.cardData.set({
            ...this.cardData(),
            ownerName: result.cardHolder,
            isSkeleton: false,
          });
        },
        error: (err) => {
          // Handle errors - component specific logic
          this.cardData.set({
            ...this.cardData(),
            isSkeleton: false,
          });
          if (err.type === 'validation') {
            this.form().controls['sourceCardNumber'].setErrors({ serverValidationError: true });
            this.errorServerMessage.set(err.error.result.message);
          } else {
            this.messageService.showErrorMessage(err.error.result.message);
          }
          // General errors are already handled in service
        },
      });
  }

  continue() {
    this.c2cStateService.selectedSourceCard.set(null);
    // at the first, we must register the card then go to the next step
    if (this.bank()?.cardExternalRegistrationMode !== CardRegistration.IGNORE && this.form().controls['sourceCardNumber'].valid) {
      //  go to shaparak confirmation
      this.registerByShaparak();
    } else {
      this.registerCard(CardZonesEnum.internal);
    }
  }

  registerByShaparak() {
    const card = {
      bankName: this.sourceCardProfile()?.bankName || '',
      bankLogoImageId: this.bank()?.imageId || '',
      pan: this.sourceCardProfile()?.pan || '',
      cardOwner: this.sourceCardProfile()?.cardHolder || '',
      externalRegistrationMode: this.bank()?.cardExternalRegistrationMode as number,
    } as BankCard;
    this.shaparakService
      .confirmShaparakRegistration(card)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.registerCard(CardZonesEnum.internal);
      });
  }

  private fixDates(year: string, month: string, yearPrefix = '14'): string {
    const fullYear = parseInt(year) >= 10 ? year : `0${parseInt(year)}`;
    const fullMonth = parseInt(month) >= 10 ? month : `0${parseInt(month)}`;
    return `${yearPrefix}${fullYear}/${fullMonth}`;
  }

  registerCard(cardZone: CardZonesEnum): void {
    // Early return if already processing
    if (this.registerSpinner()) {
      return;
    }

    this.registerSpinner.set(true);

    const cardNumber = this.sourceCardNumber();
    const cardHolder = this.sourceCardProfile()?.cardHolder || '';
    const formValue = this.form().value;
    const cardExpDate = this.fixDates(formValue.cardExpYear, formValue.cardExpMonth);

    this.shaparakService
      .registerNewCard(cardNumber, cardZone, false, cardHolder, cardExpDate)
      .pipe(
        catchError((err) => {
          this.messageService.showErrorOfErrorResponse(err);
          return throwError(() => err);
        }),
        takeUntilDestroyed(this.destroyRef),
        switchMap(() => this.c2cCardManagementService.loadSourceCardsList()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.changeStep.emit();
          this.messageService.showSuccessMessage('کارت بانکی ذخیره شد.');
        },
        error: () => {
          this.registerSpinner.set(false);
        },
      });
  }

  findBank(prefix: string) {
    const bank = this.c2cMainService.findBankByPrefix(prefix);
    if (bank) {
      if (bank?.name === this.bankName()) {
        // prevent redundant renders
        return;
      }
      this.bank.set(this.c2cMainService.findBankByPrefix(prefix));
      this.bankName.set(this.bank?.name || '');
    } else {
      if (this.bank() === null) {
        // prevent redundant renders, bank is already null, so no need to set color again
        return;
      }
      this.bank.set(null);
      this.bankName.set('کارت بانکی');
    }
    this.c2cStateService.sourceBank.set(this.bank());
  }
}
