import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { C2cStepsEnum } from '../../data-access/models/c2c-steps';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { ModifiedC2cFrequentTransaction } from '../../data-access/models/c2c-frequent-transaction-response';
import { C2cStateService } from '../../data-access/services/c2c-state.service';
import { BankCardApiService } from '@client-monorepo/daily-fintech/bank-card';
import { MessageService } from '@client-monorepo/common/utilities';
import { ActivatedRoute, Router } from '@angular/router';
import { C2cMainService } from '../../data-access/services/c2c-main.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { C2cFrequentTransactionCardComponent } from '../c2c-frequent-transaction-card/c2c-frequent-transaction-card.component';
import { C2cFrequentTransactionActionsComponent } from '../c2c-frequent-transaction-actions/c2c-frequent-transaction-actions.component';
import { C2cCardTitleComponent } from '../c2c-card-title/c2c-card-title.component';

@Component({
  selector: 'c2c-applet-c2c-frequent-transaction-section',
  standalone: true,
  imports: [CommonModule, C2cFrequentTransactionCardComponent, C2cCardTitleComponent],
  templateUrl: './c2c-frequent-transaction-section.component.html',
  styleUrls: ['./c2c-frequent-transaction-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class C2cFrequentTransactionSectionComponent implements OnInit {
  // Injects
  private bottomSheetService = inject(NgxBottomSheetService);
  private c2cStateService = inject(C2cStateService);
  private messageService = inject(MessageService);
  private bankCardApiService = inject(BankCardApiService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private c2cMainService = inject(C2cMainService);
  private readonly destroyRef = inject(DestroyRef);

  // Computed properties
  readonly hasFrequentTransaction = computed(() => this.c2cFrequentTransactions().length > 0);
  readonly c2cFrequentTransactions = computed(() => this.c2cStateService.c2cFrequentTransactions() || []);
  readonly allBanksCodes = computed<string[]>(() => this.c2cStateService.allBanksCodes() || []);
  readonly transActionNumber = computed(() => {
    const label = 'تراکنش';
    const count = this.c2cFrequentTransactions()?.length ?? 0;
    return `${count} ${label}`;
  });

  // State
  private readonly checkedTransaction = signal(false);

  constructor() {
    this.initializeRecommendationEffect();
  }

  ngOnInit(): void {
    this.setupQueryParamsSubscription(); // TODO: check the scenario?
  }

  private initializeRecommendationEffect(): void {
    effect(
      () => {
        this.processRecommendationFromUrl();
      },
      { allowSignalWrites: true },
    );
  }

  private setupQueryParamsSubscription(): void {
    this.activatedRoute.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.handleQueryParams(params);
    });
  }

  private handleQueryParams(params: any): void {
    const itemId = params['id'];
    if (itemId) {
      const recommendedItem = this.findTransactionById(itemId);
      if (recommendedItem) {
        this.goToNextStep(recommendedItem); // TODO: check flow with "this.onClickedItem(recommendItem)" instead
        this.router.navigate([], { relativeTo: this.activatedRoute });
      }
    }
  }

  /**
   * Processes recommendation ID from URL query parameters during component initialization.
   * Automatically selects and processes matching frequent transactions.
   */
  private processRecommendationFromUrl(): void {
    if (!this.canProcessRecommendation()) {
      return;
    }

    this.checkedTransaction.set(true);
    const recommendationId = this.getRecommendationIdFromUrl();

    if (recommendationId) {
      this.processRecommendation(recommendationId);
    }
  }

  private getRecommendationIdFromUrl(): string | null {
    return this.activatedRoute.snapshot.queryParams['recommendation'] || null;
  }

  private processRecommendation(recommendationId: string): void {
    const matchingTransaction = this.findTransactionById(recommendationId);
    if (matchingTransaction) {
      this.onClickedItem(matchingTransaction);
      this.clearUrlQueryParams();
    }
  }

  private clearUrlQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {},
      replaceUrl: true,
    });
  }

  private canProcessRecommendation(): boolean {
    const storedCards = this.c2cStateService.sourceStoredCards();
    return (
      !this.checkedTransaction() && this.c2cFrequentTransactions().length > 0 && storedCards.length > 0 && this.allBanksCodes().length > 0
    );
  }

  private findTransactionById(id: string): ModifiedC2cFrequentTransaction | undefined {
    return this.c2cFrequentTransactions().find((transaction) => transaction.id === id);
  }

  moreAction(item: ModifiedC2cFrequentTransaction) {
    this.bottomSheetService.openBottomSheet(C2cFrequentTransactionActionsComponent, { ...item }, { noPadding: true });
  }

  onClickedItem(item: ModifiedC2cFrequentTransaction): void {
    const srcCard = this.c2cMainService.getStoredCardByIndex(item.sourceIndex);
    const customCallbackPath = `edit/${item.id}`;

    // Use handleCardProtections method but skip registration check for frequent transactions
    this.c2cMainService
      .handleCardProtections(srcCard, 'source', customCallbackPath, true)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          if (result.success) {
            this.goToNextStep(item);
          }
        },
        error: (error) => this.messageService.showErrorOfErrorResponse(error),
      });
  }

  goToNextStep(item: ModifiedC2cFrequentTransaction): void {
    this.setupSourceCardToGoNextStep(item);
    this.setupDestinationCardToGoNextStep(item);
  }

  private setupSourceCardToGoNextStep(item: ModifiedC2cFrequentTransaction): void {
    const srcCard = this.c2cMainService.getStoredCardByIndex(item.sourceIndex);
    const bank = this.c2cMainService.findBankByPrefix(srcCard.prefix);
    this.c2cStateService.sourceBank.set(bank);
    this.c2cStateService.selectedSourceCard.set(srcCard);
    this.c2cStateService.sourceCardProfileData.set(null);
  }

  private setupDestinationCardToGoNextStep(item: ModifiedC2cFrequentTransaction): void {
    this.bankCardApiService
      .getCardDetailApi(item.destinationIndex)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.c2cStateService.selectedDestCard.set(response.card);
          this.c2cStateService.isFromFrequentTransaction.set(true);
          this.c2cStateService.amount.set(item.amount);
          this.bottomSheetService.outputData.set(null);
          this.c2cMainService.goToStep(C2cStepsEnum.CREDENTIALS);
        },
        error: (error) => this.messageService.showErrorOfErrorResponse(error),
      });
  }
}
