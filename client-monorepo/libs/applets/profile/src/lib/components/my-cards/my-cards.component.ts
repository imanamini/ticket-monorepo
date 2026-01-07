import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  OnInit,
  OutputRefSubscription,
  signal,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  BankCardApiService,
  BankCardService,
  CardApiResponse,
  CardPreviewConfigInterface,
  CardSummaryComponent,
  CardSummaryOutputDataInterface,
  PreviewComponent,
} from '@client-monorepo/daily-fintech/bank-card';
import { NoItemComponent, SearchComponent } from '@client-monorepo/common/ui-components';

import { RouterLink } from '@angular/router';
import { MessageService } from '@client-monorepo/common/utilities';
import { NgxBottomNavigationService } from '@digipay/ngx-bottom-navigation';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxFabComponent } from '@digipay/ngx-button';

@Component({
  selector: 'profile-applet-my-cards',
  standalone: true,
  imports: [CommonModule, PreviewComponent, SearchComponent, RouterLink, NoItemComponent, NgxFabComponent],
  templateUrl: './my-cards.component.html',
  styleUrl: './my-cards.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCardsComponent implements OnInit {
  allMyCards = signal<Array<WritableSignal<CardPreviewConfigInterface>>>([]);
  filteredMyCards = computed<Array<WritableSignal<CardPreviewConfigInterface>>>(() => {
    if (this.searchText()) {
      return this.allMyCards().filter(
        (d) => d().cardNumber?.includes(this.searchText() as string) || d().ownerName?.includes(this.searchText() as string),
      );
    } else {
      return [...this.allMyCards()];
    }
  });
  searchText = signal<string | undefined>(undefined);
  initialized = signal(false);

  bottomSheetService = inject<NgxBottomSheetService<CardSummaryOutputDataInterface>>(NgxBottomSheetService);
  bankCardApi = inject(BankCardApiService);
  bankCardService = inject(BankCardService);
  messageService = inject(MessageService);
  bottomNavigationService = inject(NgxBottomNavigationService);
  cdrf = inject(ChangeDetectorRef);
  bottomSheetCloseSubscriber!: OutputRefSubscription;
  availableServiceType = signal<number[]>([]);

  bottonStyle = computed(() => {
    return {
      bottom: this.bottomNavigationService.reservedHeight() + 'px',
    };
  });

  ngOnInit() {
    this.getMyCards();
  }

  getMyCards(): void {
    this.bankCardApi.getUserCards().subscribe({
      next: (res: CardApiResponse) => {
        this.availableServiceType.set(res.availableServiceType);
        this.allMyCards.set(this.bankCardService.mapApiCardsToClientCards(res.cards));
        this.initialized.set(true);
      },
    });
  }

  openCardSummary(card: WritableSignal<CardPreviewConfigInterface>): void {
    const tempCard = { ...card(), isMinimized: true };
    setTimeout(() => {
      this.bottomSheetService.openBottomSheet(CardSummaryComponent, { card: tempCard, availableServiceType: this.availableServiceType() });
    }, 10);
    this.bottomSheetCloseSubscriber = this.bottomSheetService.onClose.subscribe(() => {
      this.allMyCards.update((cards) => {
        const outputData = this.bottomSheetService.outputData();
        this.bottomSheetService.outputData.set(null);
        this.bottomSheetCloseSubscriber.unsubscribe();
        if (!outputData?.card || !outputData?.action) {
          return cards;
        }
        const tempCard = cards.find((c) => c().cardNumber === outputData.card.cardNumber);
        if (!tempCard) {
          return cards;
        }

        if (outputData.action === 'delete') {
          const cardIndex = cards.findIndex((c) => c().cardNumber === outputData.card.cardNumber);
          cards.splice(cardIndex, 1);
          return [...cards];
        }

        if (outputData.action === 'togglePin') {
          tempCard.update((c) => ({ ...c, isPinned: !c.isPinned }));
          return [...this.bankCardService.sortCards(cards)];
        }

        if (outputData.action === 'toggleBnpl') {
          this.getMyCards();
        }
        return cards;
      });
    });
  }

  togglePin(card: WritableSignal<CardPreviewConfigInterface>) {
    const bankName = card().bankName?.replace('بانک ', '');
    this.bankCardApi.togglePin(bankName as string, card().id as string, !card().isPinned).subscribe({
      next: () => {
        this.messageService.showSuccessMessage('کارت با موفقیت به روز رسانی شد.');
        this.allMyCards.update((cards) => {
          const tempCard = cards.find((c) => c().cardNumber === card().cardNumber);
          if (tempCard) {
            tempCard.set({ ...tempCard(), isPinned: !tempCard().isPinned });
            return [...this.bankCardService.sortCards(cards)];
          }
          return cards;
        });
        this.cdrf.markForCheck();
      },
      error: () => {
        this.messageService.showErrorMessage('در به روز رسانی کارت خطایی به وجود آمده است.');
      },
    });
  }

  deleteCard(card: CardPreviewConfigInterface) {
    this.bankCardApi.deleteCard(card.id as string).subscribe({
      next: () => {
        this.messageService.showSuccessMessage('کارت با موفقیت حذف شد.');
        this.allMyCards.update((cards) => {
          const cardIndex = cards.findIndex((c) => c().cardNumber === card.cardNumber);
          cards.splice(cardIndex, 1);
          return [...cards];
        });
      },
      error: () => {
        this.messageService.showErrorMessage('در حذف کارت خطایی به وجود آمده است.');
      },
    });
  }
}
