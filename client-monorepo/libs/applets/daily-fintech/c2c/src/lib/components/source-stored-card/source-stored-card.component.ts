import { AfterViewInit, ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, Renderer2, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankCard, PreviewComponent } from '@client-monorepo/daily-fintech/bank-card';
import { NgxCard } from '@digipay/ngx-card';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { C2cFrequentTransactionSectionComponent } from '../c2c-frequent-transaction-section/c2c-frequent-transaction-section.component';
import { C2cStateService } from '../../data-access/services/c2c-state.service';
import { C2cStepsEnum } from '../../data-access/models/c2c-steps';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { C2cCardTitleComponent } from '../c2c-card-title/c2c-card-title.component';
import { NgxDpCarouselComponent, NgxDpCarouselSlideDirective } from '@digipay/ngx-dp-carousel';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { C2cMainService } from '../../data-access/services/c2c-main.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { C2cCardHelper } from '../../utils/c2c-card';
import { NgxBadgeModule } from '@digipay/ngx-badge';

@Component({
  selector: 'c2c-applet-source-stored-card',
  standalone: true,
  imports: [
    CommonModule,
    NgxCard,
    PreviewComponent,
    NgxButtonComponent,
    C2cFrequentTransactionSectionComponent,
    UiFormFieldBuilderModule,
    C2cCardTitleComponent,
    NgxDpCarouselComponent,
    NgxDpCarouselSlideDirective,
    ReactiveFormsModule,
    NgxBadgeModule,
  ],
  templateUrl: './source-stored-card.component.html',
  styleUrls: ['./source-stored-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SourceStoredCardComponent implements OnInit, AfterViewInit {
  private readonly c2cStateService = inject(C2cStateService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);
  private readonly c2cMainService = inject(C2cMainService);
  private readonly destroyRef = inject(DestroyRef);
  renderer = inject(Renderer2);
  C2cCardHelper = C2cCardHelper;

  readonly body = signal<HTMLElement | null>(null);
  readonly cardRatio = signal<string>('1.58/1');
  readonly cardRatioOverride = signal<boolean>(false);
  readonly cardWidth = signal<string>('200px');
  readonly cardHeight = signal<string>('126px');
  readonly cardClasses = signal<string>('');
  readonly visibleCards = signal<number>(1.5);
  readonly cardStoredIndex = signal(0);
  readonly carouselIndex = signal<number>(0);
  readonly addNewCardButton = signal(true);

  readonly allBanks = computed(() => this.c2cStateService.allBanks());
  readonly cards = computed<BankCard[]>(() => {
    const banks = this.allBanks();
    const rawCards = this.c2cStateService.sourceStoredCards() || [];
    return rawCards.map((card) => {
      const bank = banks.find((b) => b.cardPrefixes.includes(card.prefix));
      return { ...card, activeBank: bank?.active ?? false };
    });
  });
  readonly hasCard = computed(() => this.cards().length > 0);
  readonly currentCard = computed(() => this.cards()[this.cardStoredIndex()] ?? null);
  readonly buttonStatus = computed<'active' | 'inactive'>(() => {
    const card = this.currentCard();
    return card && !card.activeBank ? 'inactive' : 'active';
  });
  readonly isInactive = computed(() => this.buttonStatus() === 'inactive' || !this.hasCard() || !this.currentCard()?.active);

  form = signal<FormGroup>(this.createForm());
  isActiveCard = computed(() => {
    const card = this.currentCard();
    return !(!card || !card.activeBank);
  });
  readonly shouldShaparak = computed(() => C2cCardHelper.shouldBeRegistered(this.currentCard(), 'source'));
  buttonText = computed(() => {
    return this.shouldShaparak() && this.currentCard()?.active ? 'ثبت کارت در شاپرک' : 'ادامه';
  });

  ngOnInit() {
    this.getUrlParams();
    this.body.set(this.renderer.selectRootElement('#dpx-main-layout-body', true));
    this.calculateWidth();
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      amount: [
        '',
        [
          Validators.required,
          Validators.min(this.currentCard()?.transferAmountMin ?? 0),
          Validators.max(this.currentCard()?.transferAmountMax ?? 0),
        ],
      ],
    });
  }
  /**
   * User already picked the source card
   * from payment page
   */
  private getUrlParams(): void {
    const params = this.route.snapshot.queryParams;
    if (params['card']) {
      const index = this.cards().findIndex((c) => c.pan === params['card']);
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { ...params, card: null },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
      if (index === -1) return;
      setTimeout(() => this.carouselIndex.set(index), 500);
      this.cardStoredIndex.set(index);
    }
  }

  addNewCard(): void {
    this.c2cMainService.goToStep(C2cStepsEnum.NEW_CARD);
  }

  onMoreClick(storedCard: BankCard, editable = false): void {
    this.c2cMainService.handleCardActions(storedCard, 'source', editable).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  swiped(evt: number): void {
    this.addNewCardButton.set(evt !== this.cards().length);
    this.cardStoredIndex.set(evt);
    if (!this.isActiveCard()) {
      this.form().controls['amount'].setValue('0');
      this.form().reset();
    }
  }

  continueBasedOnStoredCard(): void {
    const card = this.currentCard();
    if (!card) {
      this.addNewCard();
      return;
    }

    // Set bank first
    const bank = this.c2cMainService.findBankByPrefix(card.prefix);
    this.c2cStateService.sourceBank.set(bank);

    // Use shared method with full validation (including registration)
    this.c2cMainService
      .handleCardProtections(card, 'source')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          if (result.success) {
            // Card is ready, proceed with transaction
            this.goToNextStep();
          }
        },
      });
  }

  goToNextStep(): void {
    this.c2cStateService.selectedSourceCard.set(this.currentCard());
    this.c2cStateService.amount.set(this.form().value?.amount);
    this.c2cStateService.sourceCardProfileData.set(null);
    this.c2cMainService.goToNextStep();
  }

  ngAfterViewInit() {
    this.renderer.listen('window', 'resize', () => {
      this.calculateWidth();
    });
  }

  calculateWidth(): void {
    const bodyWidth = this.body()?.offsetWidth || 0;
    if (bodyWidth < 350) {
      this.cardWidth.set('200px');
      this.cardHeight.set('126px');
      this.cardRatio.set('1.58/1');
      this.cardRatioOverride.set(true);
      this.cardClasses.set('');
      this.visibleCards.set(1.4);
    } else if (bodyWidth < 400) {
      this.cardWidth.set('252px');
      this.cardHeight.set('160px');
      this.cardRatio.set('1.58/1');
      this.cardRatioOverride.set(true);
      this.cardClasses.set('');
      this.visibleCards.set(1.3);
    } else if (bodyWidth < 500) {
      this.cardWidth.set('270px');
      this.cardHeight.set('170px');
      this.cardRatio.set('1.58/1');
      this.cardRatioOverride.set(true);
      this.cardClasses.set('');
      this.visibleCards.set(1.4);
    } else {
      this.cardWidth.set('324px');
      this.cardHeight.set('204px');
      this.cardRatio.set('1.58/1');
      this.cardRatioOverride.set(true);
      this.cardClasses.set('');
      this.visibleCards.set(1.45);
    }
  }
}
