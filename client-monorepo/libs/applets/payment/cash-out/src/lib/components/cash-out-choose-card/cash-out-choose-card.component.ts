import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { NgxCard } from '@digipay/ngx-card';
import { Bank, BankCardApiService, PreviewComponent } from '@client-monorepo/daily-fintech/bank-card';
import { finalize, map, Subject, Subscription, switchMap, takeUntil, tap } from 'rxjs';
import { StoredCard } from '../../data-access/models/stored-card.model';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { CashOutStateService } from '../../data-access/services/cash-out-state.service';
import { Router } from '@angular/router';
import { CashOutConfirmationComponent } from '../cash-out-confirmation/cash-out-confirmation.component';
import { OnHoldDirective } from '@client-monorepo/common/utilities';
import { PanTypeEnum } from '../../data-access/models/pan-type.enum';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxDpCarouselComponent, NgxDpCarouselSlideDirective } from '@digipay/ngx-dp-carousel';
import { WALLET_GTM_TAG, WalletGtmService } from '@client-monorepo/payment/wallet';

@Component({
  selector: 'cash-out-applet-choose-card',
  standalone: true,
  imports: [
    NgxCard,
    PreviewComponent,
    NgxSkeletonLoadingComponent,
    OnHoldDirective,
    NgxButtonComponent,
    NgxDpCarouselSlideDirective,
    NgxDpCarouselComponent,
  ],
  templateUrl: './cash-out-choose-card.component.html',
  styleUrl: './cash-out-choose-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashOutChooseCardComponent implements OnInit, OnDestroy {
  private readonly bank = inject(BankCardApiService);
  private readonly router = inject(Router);
  private readonly state = inject(CashOutStateService);
  private readonly bottomSheet = inject<NgxBottomSheetService<any>>(NgxBottomSheetService);
  private readonly walletGtm = inject(WalletGtmService);

  carouselIndex = signal<number>(0);
  loading = signal<boolean>(false);
  buttonStatus: 'active' | 'inactive' = 'active';
  addNewCardButton = true;
  cardStoredIndex = 0;

  allBanks: Bank[] = [];
  private destroy = new Subject<void>();
  cards = signal<StoredCard[]>([]);
  selectedCard = signal<StoredCard | null>(null);
  bottomSheetCloseSubscription!: Subscription;

  ngOnInit(): void {
    this.fetchCardData();
  }

  swiped(index: number): void {
    this.addNewCardButton = index !== this.cards().length;
    this.cardStoredIndex = index;
    const currentCard = this.cards()?.[index];
    if (!currentCard) return;
    this.checkButtonStatus(currentCard);
    this.saveSelectedCard(currentCard);
  }

  private fetchCardData(): void {
    this.loading.set(true);
    const bankMap = new Map<string, { active: boolean }>();

    this.bank
      .getAllBanks()
      .pipe(
        tap((data) => this.mapBankPrefixes(data.banks, bankMap)),
        switchMap((data) => this.getCards(data.banks)),
        map((data) =>
          data.cards.map((card) => ({
            ...card,
            activeBank: bankMap.get(card.prefix)?.active || false,
          })),
        ),
        finalize(() => this.loading.set(false)),
        takeUntil(this.destroy),
      )
      .subscribe((cardsWithActiveBanks) => this.handleFetchedCards(cardsWithActiveBanks));
  }

  private mapBankPrefixes(banks: Bank[], bankMap: Map<string, { active: boolean }>): void {
    banks.forEach((bank) =>
      bank.cardPrefixes.forEach((prefix) => {
        bankMap.set(prefix, { active: bank.active });
      }),
    );
    this.allBanks = banks;
  }

  private getCards(banks: Bank[]) {
    return this.bank.searchCards(
      { type: 'source', serviceType: 0 },
      {
        restrictions: [
          {
            type: 'collection',
            field: 'bankCodes',
            values: banks,
          },
        ],
      },
    );
  }

  private handleFetchedCards(cardsWithActiveBanks: StoredCard[]): void {
    this.cards.set(cardsWithActiveBanks);
    this.initializeSelectedCard(cardsWithActiveBanks);
  }

  private initializeSelectedCard(cards: StoredCard[]): void {
    if (!this.selectedCard()) {
      const firstCard = cards[0];
      this.selectedCard.set(firstCard);
      this.saveSelectedCard(firstCard);
    }
  }

  public saveSelectedCard(card: StoredCard): void {
    this.selectedCard.set(card);
    this.state.dispatch({
      type: 'UPDATE_CARD_INFO',
      payload: {
        ...card,
        type: PanTypeEnum.INDEX,
      },
    });
  }

  private checkButtonStatus(card: StoredCard): void {
    this.buttonStatus = card?.activeBank ? 'active' : 'inactive';
  }

  confirm() {
    if (!this.selectedCard()) return;
    this.openBottomSheet();
    this.handleBottomSheetClose();
  }

  openBottomSheet() {
    this.bottomSheet.openBottomSheet(CashOutConfirmationComponent, {});
  }

  handleBottomSheetClose() {
    this.bottomSheetCloseSubscription = this.bottomSheet.onClose.pipe(takeUntil(this.destroy)).subscribe(() => {});
  }

  navigateToNewCard() {
    this.walletGtm.publishEvent(WALLET_GTM_TAG.CASHOUT_NEW_CARD);
    this.router.navigate(['cash-out/card/add-card'], { queryParams: { redirectTo: '/cash-out/card/choose-card' } });
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
