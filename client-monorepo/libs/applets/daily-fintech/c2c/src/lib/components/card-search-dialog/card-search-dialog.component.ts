import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, model, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankCard, PreviewComponent } from '@client-monorepo/daily-fintech/bank-card';
import { FormsModule } from '@angular/forms';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { SearchComponent } from '@client-monorepo/common/ui-components';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { OnHoldDirective, ScrolledToEndDirective } from '@client-monorepo/common/utilities';
import { C2cStateService } from '../../data-access/services/c2c-state.service';
import { C2cMainService } from '../../data-access/services/c2c-main.service';
import { debounceTime, tap } from 'rxjs';
import { C2cCardHelper } from '../../utils/c2c-card';

@Component({
  selector: 'c2c-applet-card-search-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, DpIconComponent, SearchComponent, OnHoldDirective, PreviewComponent, ScrolledToEndDirective],
  templateUrl: './card-search-dialog.component.html',
  styleUrls: ['./card-search-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardSearchDialogComponent implements OnInit {
  // Injects
  private readonly c2cStateService = inject(C2cStateService);
  private readonly c2cMainService = inject(C2cMainService);
  private readonly destroyRef = inject(DestroyRef);

  // Outputs
  readonly handleClose = output<{ card?: BankCard }>();

  // Computed properties
  readonly allCards = computed<BankCard[]>(() => this.c2cStateService.destinationStoredCards() || []);
  readonly loading = computed<boolean>(() => this.c2cStateService.isLoadingDestinationCards());
  readonly isSearchResulEmpty = computed(() => this.allCards().length > 0 && this.cards().length === 0);

  // Signals and models
  readonly cards = signal<BankCard[]>([]);
  readonly keyword = model<string>('');

  // Private properties
  private pendingSearchRequest = false;
  private readonly SEARCH_DEBOUNCE_TIME = 100;
  private readonly SEARCHABLE_FIELDS: Array<keyof BankCard> = ['pan', 'cardOwner', 'alias', 'bankName'];

  constructor() {
    this.setupKeywordWatcher();
    this.setupAllCardsWatcher();
  }

  ngOnInit(): void {
    this.processAfterGettingCards();
    this.updateFilteredCards(this.allCards());
  }

  chooseCard(card: BankCard): void {
    this.handleClose.emit({ card });
  }

  closeDialog(): void {
    this.handleClose.emit({});
  }

  cardActions(card: BankCard): void {
    this.c2cMainService
      .handleCardActions(card, 'destination')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.refreshData();
          this.processAfterGettingCards();
        },
        error: (error) => {
          console.warn('[CardSearchDialog] Error handling card actions:', error);
          this.refreshData();
        },
      });
  }

  loadNewPage(): void {
    if (this.canLoadNewPage()) {
      this.pendingSearchRequest = false;
      this.getDestinationCards();
    }
  }

  private setupKeywordWatcher(): void {
    toObservable(this.keyword)
      .pipe(debounceTime(this.SEARCH_DEBOUNCE_TIME), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.updateFilteredCards(this.allCards());
        },
        error: (error) => {
          console.warn('[CardSearchDialog] Error in keyword watcher:', error);
        },
      });
  }

  private setupAllCardsWatcher(): void {
    toObservable(this.allCards)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (destCards) => {
          this.updateFilteredCards(destCards);
        },
        error: (error) => {
          console.warn('[CardSearchDialog] Error in allCards watcher:', error);
        },
      });
  }

  private getDestinationCards(): void {
    this.c2cMainService
      .loadNextDestinationCardsPage()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => this.processAfterGettingCards()),
      )
      .subscribe({
        error: (error) => {
          console.warn('[CardSearchDialog] Error loading destination cards:', error);
          this.processAfterGettingCards();
        },
      });
  }

  private processAfterGettingCards(): void {
    this.pendingSearchRequest = true;
  }

  private updateFilteredCards(destCards: BankCard[]): void {
    const keyword = this.keyword();

    if (!keyword) {
      this.cards.set([...destCards]);
      return;
    }

    const filteredCards = C2cCardHelper.filterBySearch(destCards, keyword);
    this.cards.set(filteredCards);
  }

  private refreshData(): void {
    this.pendingSearchRequest = false;
  }

  private canLoadNewPage(): boolean {
    return this.pendingSearchRequest;
  }
}
