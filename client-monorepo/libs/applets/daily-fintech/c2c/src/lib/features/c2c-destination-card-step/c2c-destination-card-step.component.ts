import { AfterViewInit, ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs/operators';
import { convertNonEnglishDigits } from '@digipay/strings';
import { CommonModule } from '@angular/common';
import { Bank, BankCard, CardProfile, PreviewComponent } from '@client-monorepo/daily-fintech/bank-card';
import { getCardPanPrefix, MessageService, OnHoldDirective, ScrolledToEndDirective } from '@client-monorepo/common/utilities';
import { bankCardNumberValidator } from '../../data-access/validators/supported-card-number.validator';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { CardSearchDialogComponent } from '../../components/card-search-dialog/card-search-dialog.component';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { C2cStateService } from '../../data-access/services/c2c-state.service';
import { C2cMainService } from '../../data-access/services/c2c-main.service';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { NgxCheckboxComponent } from '@digipay/ngx-checkbox';
import { C2cCardTitleComponent } from '../../components/c2c-card-title/c2c-card-title.component';
import { C2cCardHelper } from '../../utils/c2c-card';
import { DpIconComponent } from '@client-monorepo/common/icon';

@Component({
  selector: 'c2c-applet-c2c-destination-card-step',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    UiFormFieldBuilderModule,
    ReactiveFormsModule,
    OnHoldDirective,
    CardSearchDialogComponent,
    ScrolledToEndDirective,
    PreviewComponent,
    NgxButtonComponent,
    NgxSkeletonLoadingComponent,
    NgxCheckboxComponent,
    C2cCardTitleComponent,
    DpIconComponent,
  ],
  templateUrl: './c2c-destination-card-step.component.html',
  styleUrls: ['./c2c-destination-card-step.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class C2cDestinationCardStepComponent implements OnInit, AfterViewInit {
  // Injects
  private readonly c2cStateService = inject(C2cStateService);
  private readonly c2cMainService = inject(C2cMainService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly messageService = inject(MessageService);
  private readonly formBuilder = inject(UntypedFormBuilder);

  // Computed properties
  readonly allBanks = computed<Bank[]>(() => this.c2cStateService.allBanks());
  readonly sourceCard = computed(() => this.c2cStateService.selectedSourceCard());
  readonly loading = computed<boolean>(() => this.c2cStateService.isLoadingDestinationCards());
  readonly shouldShowBankInfo = computed(() => !!(this.bank() && this.destForm.valid && !this.errorServerMessage()));
  readonly destinationCardsFromState = computed<BankCard[]>(() => this.c2cStateService.destinationStoredCards() || []);

  // Signals
  readonly destinationCards = signal<BankCard[]>([]);
  readonly itemsList = signal<{ profile: BankCard }[]>([]);
  readonly initialized = signal(false);
  readonly getProfileCardSpinner = signal(false);
  readonly errorServerMessage = signal('');
  readonly isSearchActive = signal(false);
  readonly wantToSaveCard = signal(this.c2cStateService.shouldRegisterDestinationCard());
  readonly bank = signal<Bank | null>(null);
  readonly destinationCardProfile = signal<CardProfile | null>(null);

  // Form
  destForm!: UntypedFormGroup;

  // Private properties
  private pendingSearchRequest = false;
  private readonly CARD_NUMBER_LENGTH = 16;

  constructor() {
    this.initializeForm();
    this.setupDestinationCardsWatcher();
  }

  ngOnInit(): void {
    this.initializeComponent();
    this.setupForm();
    this.loadInitialDataIfNeeded();
  }

  ngAfterViewInit(): void {
    this.scrollToTop();
  }

  goBack(): void {
    this.c2cStateService.enteredDestinationPan.set('');
    this.c2cMainService.goToPrevStep();
  }

  cardActions(card: BankCard): void {
    this.c2cMainService
      .handleCardActions(card, 'destination', false)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          if (result) {
            this.refreshData();
          }
        },
      });
  }

  goNextStep(): void {
    this.c2cStateService.shouldRegisterDestinationCard.set(this.wantToSaveCard());
    this.c2cStateService.selectedDestCard.set(null);
    this.c2cMainService.goToNextStep();
  }

  storedDestinationCardClick(card: BankCard, event?: Event): void {
    event?.stopPropagation();

    if (this.isSameAsSourceCard(card)) {
      this.messageService.showErrorMessage('این شماره کارت به عنوان کارت مبدا انتخاب شده‌است.');
      return;
    }

    this.selectDestinationCard(card);
  }

  openSearchDialog(): void {
    this.isSearchActive.set(true);
  }

  handleSearchClose(result: { card?: BankCard }): void {
    this.isSearchActive.set(false);

    if (result.card) {
      this.storedDestinationCardClick(result.card);
    }
  }

  loadNewPage(): void {
    if (this.canLoadNewPage()) {
      this.pendingSearchRequest = false;
      this.getDestinationCards();
    }
  }

  private initializeForm(): void {
    this.destForm = this.formBuilder.group({
      destinationCardNumber: [''],
    });
  }

  private setupDestinationCardsWatcher(): void {
    toObservable(this.destinationCardsFromState)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((cards) => {
        this.updateDestinationCards(cards);
      });
  }

  private initializeComponent(): void {
    this.resetComponentState();
  }

  private resetComponentState(): void {
    this.c2cStateService.destinationStoredCards.set([]);
  }

  private setupForm(): void {
    this.setupFormValidators();
    this.setupFormValueChanges();
    this.patchFormValue();
  }

  private setupFormValidators(): void {
    this.destForm.controls['destinationCardNumber'].setValidators([
      Validators.required,
      bankCardNumberValidator(this.allBanks()),
      this.checkTheSameDestinationCard.bind(this),
    ]);
  }

  private setupFormValueChanges(): void {
    this.destForm.controls['destinationCardNumber'].valueChanges
      .pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((val) => {
        const cardNumber = convertNonEnglishDigits(val || '');
        this.checkDestCardInfo(cardNumber);
      });
  }

  private loadInitialDataIfNeeded(): void {
    if (this.itemsList().length === 0) {
      this.getDestinationCards();
    }
  }

  private scrollToTop(): void {
    setTimeout(() => {
      window.scrollTo({ top: 0 });
    }, 100);
  }

  private updateDestinationCards(cards: BankCard[]): void {
    const uniqueCards = C2cCardHelper.removeDuplicates(cards);
    this.destinationCards.set(uniqueCards);

    if (cards?.length > 0) {
      this.pendingSearchRequest = true;
      this.convertCards(this.destForm.controls['destinationCardNumber'].value);
    } else {
      this.c2cStateService.destinationCardCurrentPage.set(0); // TODO: Check side effect
    }

    this.patchFormValue();
  }

  private checkTheSameDestinationCard(control: AbstractControl) {
    const destinationPan = control.value;

    if (!destinationPan) {
      return null;
    }

    if (destinationPan === this.sourceCard()?.pan) {
      return { sameCardNumber: true };
    }

    return null;
  }

  private getDestinationCards(): void {
    this.c2cMainService
      .loadNextDestinationCardsPage()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.initialized.set(true);
        },
        error: () => {
          this.initialized.set(true);
        },
      });
  }

  private patchFormValue(): void {
    const cardNumber = this.c2cStateService.enteredDestinationPan();
    if (cardNumber) {
      this.destForm.controls['destinationCardNumber'].patchValue(cardNumber);
    }
  }

  private checkDestCardInfo(cardNumber: string): void {
    const destinationCardNumberWithoutDashes = C2cCardHelper.removePanDashes(cardNumber);
    const prefix = getCardPanPrefix(destinationCardNumberWithoutDashes);

    this.c2cStateService.enteredDestinationPan.set(cardNumber);
    this.convertCards(destinationCardNumberWithoutDashes);
    this.findBank(prefix);

    if (destinationCardNumberWithoutDashes.length < this.CARD_NUMBER_LENGTH) {
      this.resetCardProfile();
    }

    // Use setTimeout to ensure form validation is complete
    setTimeout(() => {
      if (this.shouldGetProfile(destinationCardNumberWithoutDashes)) {
        this.getProfile(destinationCardNumberWithoutDashes);
      }
    }, 0);
  }

  private resetCardProfile(): void {
    this.c2cStateService.destCardProfileData.set(null);
    this.destinationCardProfile.set(null);
    this.errorServerMessage.set('');
  }

  private shouldGetProfile(cardNumber: string): boolean {
    return cardNumber.length === this.CARD_NUMBER_LENGTH && this.destForm.valid;
  }

  private getProfile(cardNumber: string): void {
    this.getProfileCardSpinner.set(true);

    this.c2cMainService
      .loadCardProfile(cardNumber, this.bank())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.handleProfileSuccess(result);
        },
        error: (err) => {
          this.handleProfileError(err);
        },
      });
  }

  private handleProfileSuccess(result: CardProfile): void {
    this.destinationCardProfile.set(result);
    this.c2cStateService.destCardProfileData.set(result);
    this.errorServerMessage.set('');
    this.getProfileCardSpinner.set(false);
  }

  private handleProfileError(err: any): void {
    this.getProfileCardSpinner.set(false);
    if (err.type === 'validation') {
      this.errorServerMessage.set(err.error.result.message);
      this.destForm.controls['destinationCardNumber'].setErrors({ serverValidationError: true });
    } else {
      this.messageService.showErrorOfErrorResponse(err.error);
    }
  }

  private isSameAsSourceCard(card: BankCard): boolean {
    return card.pan === this.sourceCard()?.pan;
  }

  private selectDestinationCard(card: BankCard): void {
    this.findBank(card.prefix);
    this.c2cStateService.selectedDestCard.set(card);
    this.c2cStateService.destCardProfileData.set(null);
    this.c2cMainService.goToNextStep();
  }

  private findBank(prefix: string): void {
    const foundBank = this.c2cMainService.findBankByPrefix(prefix);
    this.bank.set(foundBank);
  }

  private convertCards(enteredCardNumber: string): void {
    this.itemsList.set([]);

    if (this.destinationCards().length > 0) {
      const items = this.destinationCards().map((card) => ({
        profile: card,
      }));
      this.itemsList.set(items);
    }

    if (enteredCardNumber) {
      this.filterItemsByCardNumber(enteredCardNumber);
    }
  }

  private filterItemsByCardNumber(cardNumber: string): void {
    const filtered = this.itemsList().filter((item) => item.profile.pan.includes(cardNumber));
    this.itemsList.set(filtered);
  }

  private refreshData(): void {
    this.itemsList.set([]);
    this.destinationCards.set([]);
    this.pendingSearchRequest = false;
    this.initialized.set(true);
  }

  private canLoadNewPage(): boolean {
    return this.pendingSearchRequest && this.initialized();
  }
}
