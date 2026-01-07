import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardActionOverview, PaymentCardApiService } from '@client-monorepo/payment/card-data';
import { AllCardsModel } from '../../data-access/models/all-cards.model';
import { CardCtaItems, CardsCtaItemsModel } from '../../data-access/models/cards-cta-items.model';
import { CardActionMapper, CardCtaTypes, CardTitlesItemsMap, CtaCardsOrderMapper } from '../../data-access/constants/card-cta-types.const';
import { CardsSliderComponent } from '../cards-slider/cards-slider.component';
import { CardsCtaComponent } from '../cards-cta/cards-cta.component';
import { CardCtaItemMapper, CardCtaItemType } from '../../data-access/constants/card-cta-items.const';
import { AbTestService, MessageService, rangeCreator } from '@client-monorepo/common/utilities';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { ActionHandlerService, ActionType, RedirectPayload } from '@client-monorepo/common/action-handler';
import { AllCardsArrayModel } from '../../data-access/models/all-cards-array.model';
import { CardActionButton } from '../../../../../../shared/payment/card-data/src/lib/data-access/models/card-action-button.interface';
import { NgxAppBarButtonType, NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { NgxDpCarouselComponent, NgxDpCarouselSlideDirective } from '@digipay/ngx-dp-carousel';
import { CardStatus, DigipayCard, DigipayCardApiService, DigipayCardListResponse } from '@client-monorepo/digipay-card';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'transactions-applet-card-actions',
  standalone: true,
  imports: [
    CommonModule,
    CardsSliderComponent,
    CardsCtaComponent,
    NgxSkeletonLoadingComponent,
    NgxAppBarComponent,
    NgxDpCarouselComponent,
    NgxDpCarouselSlideDirective,
  ],
  providers: [DigipayCardApiService],
  templateUrl: './card-actions.component.html',
  styleUrl: './card-actions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardActionsComponent implements OnInit {
  // Injections
  messageService = inject(MessageService);
  paymentCardApiService = inject(PaymentCardApiService);
  actionHandler = inject(ActionHandlerService);
  private digipayCardApiService = inject(DigipayCardApiService);
  private destroyRef = inject(DestroyRef);
  private abTestService = inject(AbTestService);

  // Variables
  readonly rangeCreator = rangeCreator;
  readonly cardTitlesItemsMap = CardTitlesItemsMap;
  allCards = signal<AllCardsModel>({} as AllCardsModel);
  allCardsArray = computed(() => this.convertAllCardsToKeyValueArray(this.allCards()));
  isCardsCarouselVisible = signal<boolean>(false);
  cardCtaItems = signal<CardsCtaItemsModel>({} as CardsCtaItemsModel);
  carouselActiveIndex = signal(0);
  cardsActiveIndex = signal(0);
  titleNames = computed(() => this.titleGenerator());
  isLoading = signal<boolean>(true);
  isCarouselSwiping = signal<boolean>(false);
  isCardsAnimating = signal<boolean>(false);
  digipayCardState = signal<'attachment' | 'request' | 'error' | CardStatus | null>(null);
  digipayCardId = signal<number | null>(null);
  isShowDpCard = signal(false);

  rightButton = computed(() => {
    const button: NgxAppBarButtonType = {};
    if (this.carouselActiveIndex() !== 0) {
      button.icon = 'arrow-2-right';
      button.size = 'small';
      button.style = 'link';
      button.label = this.titleNames()?.before;
    }
    return Object.keys(button)?.length ? button : null;
  });
  leftButton = computed(() => {
    const button: NgxAppBarButtonType = {};
    if (this.carouselActiveIndex() < this.allCardsArray().length - 1) {
      button.icon = 'arrow-2-left';
      button.size = 'small';
      button.style = 'link';
      button.label = this.titleNames()?.after;
    }
    return Object.keys(button)?.length ? button : null;
  });

  constructor() {
    effect(
      () => {
        if (Object.keys(this.allCards()).length > 0) {
          this.handleCarouselVisibility();
        }
      },
      { allowSignalWrites: true },
    );
  }

  ngOnInit(): void {
    this.checkShowDpCard();
    this.getSavedBankCards();
    this.getCreditWallets();
    this.getBNPLWallets();
  }

  private checkShowDpCard(): void {
    this.abTestService
      .showDPCard()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.isShowDpCard.set(res);
        this.getDigipayCard();
      });
  }
  private getDigipayCard(): void {
    if (this.isShowDpCard()) {
      this.digipayCardApiService
        .getCardList()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res: DigipayCardListResponse) => {
            const cards = res?.cardResults ?? [];

            this.digipayCardId.set(cards[0]?.uniqueId || null);

            if (cards.length === 0) {
              this.digipayCardState.set('request');
              this.allCards.set({
                ...this.allCards(),
                [CardCtaTypes.DP_CARD]: [],
              });
              this.getDebitWallets();
              return;
            }

            const isCardOwner: boolean = cards.some((c: DigipayCard) => !c.isUserCardOwner);
            if (isCardOwner) {
              this.digipayCardState.set('attachment');
              this.allCards.set({
                ...this.allCards(),
                [CardCtaTypes.DP_CARD]: [],
              });
              this.getDebitWallets();
              return;
            }

            const digipayCards: CardActionOverview[] = cards.map((c: DigipayCard) => ({
              alias: this.formatDpcardNumber(c.maskedPan),
              card: {
                mainValue: {
                  value: '',
                  textColor: undefined,
                  backgroundColor: undefined,
                  imageId: '',
                },
                alias: {
                  value: '',
                  textColor: undefined,
                  backgroundColor: undefined,
                  imageId: '',
                },
                color: [],
              },
              actionBar: {},
              isUserCardOwner: c.isUserCardOwner,
              status: c.status,
              uniqueId: c.uniqueId,
              balance: c.balance,
              expirationDate: c.expirationDate,
            }));

            this.allCards.set({
              ...this.allCards(),
              [CardCtaTypes.DP_CARD]: digipayCards,
            });
            this.getDebitWallets();
          },
          error: (error) => {
            this.allCards.set({
              ...this.allCards(),
              [CardCtaTypes.DP_CARD]: [],
            });
            this.messageService.showErrorOfErrorResponse(error);
            this.digipayCardState.set('error');
            this.getDebitWallets();
          },
        });
    } else {
      this.allCards.set({
        ...this.allCards(),
        [CardCtaTypes.DP_CARD]: [],
      });
      this.digipayCardState.set('error');
      this.getDebitWallets();
    }
  }
  private formatDpcardNumber(cardNumber: string) {
    return cardNumber?.match(/.{1,4}/g)?.join(' ');
  }
  getSavedBankCards(): void {
    this.paymentCardApiService
      .getSavedBankCards()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          const data: CardActionOverview[] = res.data;
          if (res.data.length === 0) {
            data.push({
              card: {
                logoImageId: undefined,
                imageId: undefined,
                alias: {
                  value: '',
                  textColor: undefined,
                  backgroundColor: undefined,
                  imageId: '',
                },
                mainValue: {
                  value: '',
                  textColor: undefined,
                  backgroundColor: undefined,
                  imageId: '',
                },
                color: [],
                leftLabel: {
                  value: '',
                  textColor: undefined,
                  backgroundColor: undefined,
                  imageId: '',
                },
                rightLabel: {
                  value: '',
                  textColor: undefined,
                  backgroundColor: undefined,
                  imageId: '',
                },
                featureName: '',
              },
              actionBar: {},
            });
          }
          this.allCards.set({
            ...this.allCards(),
            [CardCtaTypes.BANK_CARDS]: data,
          });
          this.isLoading.set(false);
        },
        error: (error) => {
          this.allCards.set({
            ...this.allCards(),
            [CardCtaTypes.BANK_CARDS]: [],
          });
          this.messageService.showErrorOfErrorResponse(error);
        },
      });
  }

  getDebitWallets(): void {
    if (this.digipayCardState() !== 'request' && this.digipayCardState() !== 'attachment' && this.digipayCardState() !== 'error') {
      this.allCards.set({
        ...this.allCards(),
        [CardCtaTypes.WALLET]: [],
      });
      return;
    }
    this.paymentCardApiService
      .getDebitWallets()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.allCards.set({
            ...this.allCards(),
            [CardCtaTypes.WALLET]: res.data,
          });
        },
        error: (error) => {
          this.allCards.set({
            ...this.allCards(),
            [CardCtaTypes.WALLET]: [],
          });
          this.messageService.showErrorOfErrorResponse(error);
        },
      });
  }

  getBNPLWallets(): void {
    this.paymentCardApiService
      .getBnplWallets()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.allCards.set({
            ...this.allCards(),
            [CardCtaTypes.BNPL]: res.data,
          });
        },
        error: (error) => {
          this.allCards.set({
            ...this.allCards(),
            [CardCtaTypes.BNPL]: [],
          });
          this.messageService.showErrorOfErrorResponse(error);
        },
      });
  }

  getCreditWallets(): void {
    this.paymentCardApiService
      .getCreditWallets()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.allCards.set({
            ...this.allCards(),
            [CardCtaTypes.CREDIT]: res.data,
          });
        },
        error: (error) => {
          this.allCards.set({
            ...this.allCards(),
            [CardCtaTypes.CREDIT]: [],
          });
          this.messageService.showErrorOfErrorResponse(error);
        },
      });
  }

  handleCarouselVisibility(): void {
    let isVisible = true;
    for (const key of Object.values(CardCtaTypes)) {
      isVisible = isVisible && !!this.allCards()[key];
    }
    if (isVisible !== this.isCardsCarouselVisible()) {
      if (isVisible) {
        this.convertAllCardsToKeyValueArray(this.allCards());
        this.changeCtaItems(
          this.allCardsArray()[this.carouselActiveIndex()]?.cardsType,
          this.allCardsArray()[this.carouselActiveIndex()]?.cards[0],
        );
      }
      this.isCardsCarouselVisible.set(isVisible);
    }
  }

  convertAllCardsToKeyValueArray(input: AllCardsModel): AllCardsArrayModel[] {
    return Object.keys(input)
      .filter((key) => input[key as CardCtaTypes]?.length > 0)
      .map((key) => {
        const type = CardCtaTypes[key.toUpperCase() as keyof typeof CardCtaTypes];
        return {
          cardsType: type,
          cards: this.addDefaultActionsToCards(input[key as CardCtaTypes], type),
          order: CtaCardsOrderMapper[type],
        };
      })
      .sort((a, b) => a.order - b.order);
  }

  addDefaultActionsToCards(cards: CardActionOverview[], type: CardCtaTypes): CardActionOverview[] {
    return cards.map((card) => {
      if (type === CardCtaTypes.BANK_CARDS && cards.length === 1 && card.card.mainValue.value === '') {
        return {
          ...card,
          defaultAction: {
            type: ActionType.REDIRECT,
            payload: {
              url: 'profile/saved-cards',
            },
          },
        };
      }
      return {
        ...card,
        defaultAction: CardActionMapper[type],
      };
    });
  }

  titleGenerator(): { before: string; now: string; after: string } {
    return {
      before:
        this.carouselActiveIndex() === 0 ? '' : this.cardTitlesItemsMap[this.allCardsArray()[this.carouselActiveIndex() - 1]?.cardsType],
      now: this.cardTitlesItemsMap[this.allCardsArray()[this.carouselActiveIndex()]?.cardsType],
      after:
        this.carouselActiveIndex() === this.allCardsArray.length - 1
          ? ''
          : this.cardTitlesItemsMap[this.allCardsArray()[this.carouselActiveIndex() + 1]?.cardsType],
    };
  }

  handleCarouselSwiping(isRunning: boolean): void {
    this.isCarouselSwiping.set(isRunning);
  }

  handleCardsAnimationRunning(isRunning: boolean): void {
    this.isCardsAnimating.set(isRunning);
  }

  handleCardClick(card: CardActionOverview, item: AllCardsArrayModel): void {
    // Handle DP card cta based on status
    const shouldIgnoreCardClick =
      item.cardsType === CardCtaTypes.DP_CARD && (!card.status || ![CardStatus.ISSUED, CardStatus.ACTIVE].includes(card.status));
    if (shouldIgnoreCardClick) {
      return;
    }

    if (this.isCarouselSwiping() || this.isCardsAnimating()) {
      return;
    }
    if (this.allCardsArray().indexOf(item) !== this.carouselActiveIndex()) {
      this.carouselActiveIndex.set(this.allCardsArray().indexOf(item));
      this.handleCarouselActiveIndexChange(this.carouselActiveIndex());
    } else {
      if (card && card.defaultAction) {
        this.addCloseServiceUrlToCard(card);
        this.actionHandler.handle(card.defaultAction);
      }
    }
  }

  addCloseServiceUrlToCard(card: CardActionOverview) {
    if (card.defaultAction && card.defaultAction.type === ActionType.GO_TO_SERVICE) {
      card.defaultAction.payload.closeServiceUrl = window.location.pathname;
    }
  }

  isCardSliderCollapsed(item: AllCardsArrayModel): boolean {
    return this.allCardsArray().indexOf(item) !== this.carouselActiveIndex();
  }

  handleTitleBtnClick(direction: 'next' | 'prev') {
    if (direction === 'next') {
      this.carouselActiveIndex.update((v) => v + 1);
    } else if (direction === 'prev') {
      this.carouselActiveIndex.update((v) => v - 1);
    }
    this.handleCarouselActiveIndexChange(this.carouselActiveIndex());
  }

  handleCarouselActiveIndexChange(index: number): void {
    this.carouselActiveIndex.set(index);
    this.changeCtaItems(this.allCardsArray()[index]?.cardsType, this.allCardsArray()[index]?.cards[0]);
  }

  handleCardsActiveIndexChange(index: number): void {
    this.cardsActiveIndex.set(index);
    this.changeCtaItems(
      this.allCardsArray()[this.carouselActiveIndex()]?.cardsType,
      this.allCardsArray()[this.carouselActiveIndex()]?.cards[index],
    );
  }

  changeCtaItems(cardType: CardCtaTypes, card: CardActionOverview): void {
    if (!cardType) return;

    const actionsArray: CardActionButton[] = this.extractFromObject(card?.actionBar);
    const defaultCtaArray = this.getStaticAction(cardType, card);
    const arrayToBe: CardCtaItems[] = [];

    const fromServerPart = defaultCtaArray.slice(0, actionsArray.length);

    fromServerPart.forEach((type, index) => {
      const currentStatic = { ...CardCtaItemMapper[type] };

      if (cardType === CardCtaTypes.BANK_CARDS) {
        currentStatic.isDisabled = actionsArray[index].value.includes('نیست');
        currentStatic.action.payload = {
          cardNumber: card.card.mainValue.value.replaceAll(/\s/g, ''),
        };
      }

      arrayToBe.push(currentStatic);
    });

    defaultCtaArray.slice(fromServerPart.length).forEach((type: CardCtaItemType) => {
      const currentStatic = { ...CardCtaItemMapper[type] };

      const actionsNeedChange = [
        CardCtaItemType.ACTIVE_DP_CARD,
        CardCtaItemType.PASSWORD_SETTING_DP_CARD,
        CardCtaItemType.CARD_BLOCK_DP_CARD,
        CardCtaItemType.UNBLOCKING_DP_CARD,
        CardCtaItemType.ATTACHMENT_DP_CARD,
      ];

      if (actionsNeedChange.includes(type) && this.digipayCardId()) {
        const cardId = this.digipayCardId();
        const currentUrl = (currentStatic.action.payload as RedirectPayload).url;

        if (cardId && !currentUrl.includes(`/${cardId}`)) {
          currentStatic.action.payload = {
            ...currentStatic.action.payload,
            url: currentUrl + '/' + cardId,
          };
        }
      }

      if (this.digipayCardState() === 'request') {
        CardCtaItemMapper[CardCtaItemType.ATTACHMENT_DP_CARD].action.payload = {
          url: 'card/issuance',
        };
      }
      arrayToBe.push(currentStatic);
    });
    this.cardCtaItems.set({ cardsType: cardType, actions: arrayToBe });
  }

  private getStaticAction(cardType: CardCtaTypes, card: CardActionOverview): CardCtaItemType[] {
    switch (cardType) {
      case CardCtaTypes.DP_CARD: {
        const base: CardCtaItemType[] = [CardCtaItemType.CASH_IN, CardCtaItemType.CASH_OUT];

        const statusMap: Partial<Record<CardStatus, CardCtaItemType[]>> = {
          [CardStatus.ISSUED]: [
            CardCtaItemType.ACTIVE_DP_CARD,
            CardCtaItemType.ADD_GIFT_CARD,
            CardCtaItemType.INSTRUCTIONS_DP_CARD,
            CardCtaItemType.SUPPORT,
          ],
          [CardStatus.ACTIVE]: [
            CardCtaItemType.PASSWORD_SETTING_DP_CARD,
            CardCtaItemType.CARD_BLOCK_DP_CARD,
            CardCtaItemType.REISSUE_DP_CARD,
            CardCtaItemType.ADD_GIFT_CARD,
            CardCtaItemType.INSTRUCTIONS_DP_CARD,
            CardCtaItemType.SUPPORT,
          ],
          [CardStatus.INACTIVE]: [
            CardCtaItemType.UNBLOCKING_DP_CARD,
            CardCtaItemType.REISSUE_DP_CARD,
            CardCtaItemType.ADD_GIFT_CARD,
            CardCtaItemType.INSTRUCTIONS_DP_CARD,
            CardCtaItemType.SUPPORT,
          ],
          [CardStatus.HOT]: [
            CardCtaItemType.UNBLOCKING_DP_CARD,
            CardCtaItemType.REISSUE_DP_CARD,
            CardCtaItemType.ADD_GIFT_CARD,
            CardCtaItemType.INSTRUCTIONS_DP_CARD,
            CardCtaItemType.SUPPORT,
          ],
          [CardStatus.EXPIRED]: [
            CardCtaItemType.REISSUE_DP_CARD,
            CardCtaItemType.ADD_GIFT_CARD,
            CardCtaItemType.INSTRUCTIONS_DP_CARD,
            CardCtaItemType.SUPPORT,
          ],
        };

        return [...base, ...(statusMap[card.status as CardStatus] ?? [])];
      }

      case CardCtaTypes.BANK_CARDS:
        return [CardCtaItemType.C2C, CardCtaItemType.ADD_CARD, CardCtaItemType.CONNECT_CARD_TO_CREDIT, CardCtaItemType.MY_CARDS];

      case CardCtaTypes.BNPL:
        return [CardCtaItemType.BNPL_INSTALLMENT, CardCtaItemType.STORES, CardCtaItemType.BARCODE_BUY, CardCtaItemType.QR];

      case CardCtaTypes.CREDIT:
        return [CardCtaItemType.INSTALLMENT, CardCtaItemType.STORES, CardCtaItemType.BARCODE_BUY, CardCtaItemType.QR];

      case CardCtaTypes.WALLET:
        return (this.digipayCardState() === 'attachment' || this.digipayCardState() === 'request') && this.isShowDpCard()
          ? [
              CardCtaItemType.CASH_IN,
              CardCtaItemType.CASH_OUT,
              CardCtaItemType.ATTACHMENT_DP_CARD,
              CardCtaItemType.ADD_GIFT_CARD,
              CardCtaItemType.INSTRUCTIONS_DP_CARD,
              CardCtaItemType.SUPPORT,
            ]
          : [
              CardCtaItemType.CASH_IN,
              CardCtaItemType.CASH_OUT,
              CardCtaItemType.ADD_GIFT_CARD,
              CardCtaItemType.QR,
              CardCtaItemType.TRANSFER,
            ];

      default:
        return [];
    }
  }
  extractFromObject(obj: any): any[] {
    const actions: any[] = [];
    if (obj) {
      Object.values(obj).forEach((entry: any) => {
        if (entry.action) {
          actions.push(entry.action);
        }
        if (entry.leftAction) {
          actions.push(entry.leftAction);
        }
        if (entry.rightAction) {
          actions.push(entry.rightAction);
        }
      });
    }
    return actions;
  }
}
