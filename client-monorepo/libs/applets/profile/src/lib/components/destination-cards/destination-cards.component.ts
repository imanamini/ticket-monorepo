import { ChangeDetectionStrategy, Component, computed, inject, OnInit, OutputRefSubscription, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { NoItemComponent, SearchComponent } from '@client-monorepo/common/ui-components';
import {
  BankCardApiService,
  BankCardService,
  CardApiResponse,
  CardPreviewConfigInterface,
  CardSummaryComponent,
  CardSummaryOutputDataInterface,
  PreviewComponent,
} from '@client-monorepo/daily-fintech/bank-card';

import { RouterLink } from '@angular/router';
import { MessageService } from '@client-monorepo/common/utilities';
import { NgxBottomNavigationService } from '@digipay/ngx-bottom-navigation';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxFabComponent } from '@digipay/ngx-button';

@Component({
  selector: 'profile-applet-destination-cards',
  standalone: true,
  imports: [CommonModule, PreviewComponent, UiFormFieldBuilderModule, SearchComponent, RouterLink, NoItemComponent, NgxFabComponent],
  templateUrl: './destination-cards.component.html',
  styleUrl: './destination-cards.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DestinationCardsComponent implements OnInit {
  allDestinationCards = signal<Array<WritableSignal<CardPreviewConfigInterface>>>([]);
  filteredDestinationCards = computed<Array<WritableSignal<CardPreviewConfigInterface>>>(() => {
    if (this.searchText()) {
      return this.allDestinationCards()!.filter(
        (d) => d().cardNumber?.includes(this.searchText() as string) || d().ownerName?.includes(this.searchText() as string),
      );
    } else {
      return [...this.allDestinationCards()];
    }
  });
  bottomNavigationService = inject(NgxBottomNavigationService);
  searchText = signal<string | undefined>(undefined);
  initialized = signal(false);
  bottonStyle = computed(() => {
    return {
      bottom: this.bottomNavigationService.reservedHeight() + 'px',
    };
  });

  bankCardApi = inject(BankCardApiService);
  bankCardService = inject(BankCardService);
  bottomSheetService = inject<NgxBottomSheetService<CardSummaryOutputDataInterface>>(NgxBottomSheetService);
  messageService = inject(MessageService);
  bottomSheetCloseSubscriber!: OutputRefSubscription;

  ngOnInit() {
    this.getTargetCards();
  }

  getTargetCards(): void {
    this.bankCardApi.getTargetCards().subscribe({
      next: (res: CardApiResponse) => {
        this.allDestinationCards.set(this.bankCardService.mapApiCardsToClientCards(res.cards, true));
        this.initialized.set(true);
      },
    });
  }

  openCardSummary(card: WritableSignal<CardPreviewConfigInterface>): void {
    const tempCard = { ...card(), isMinimized: true };
    setTimeout(() => {
      this.bottomSheetService.openBottomSheet(CardSummaryComponent, { card: tempCard });
    }, 10);
    this.bottomSheetCloseSubscriber = this.bottomSheetService.onClose.subscribe(() => {
      this.allDestinationCards.update((cards) => {
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
        return cards;
      });
    });
  }

  togglePin(card: WritableSignal<CardPreviewConfigInterface>) {
    const bankName = card().bankName?.replace('بانک ', '');
    this.bankCardApi.togglePin(bankName as string, card().id as string, !card().isPinned).subscribe({
      next: () => {
        this.messageService.showSuccessMessage('کارت با موفقیت به روز رسانی شد.');
        this.allDestinationCards.update((cards) => {
          const tempCard = cards.find((c) => c().cardNumber === card().cardNumber);
          if (tempCard) {
            tempCard.set({ ...tempCard(), isPinned: !tempCard().isPinned });
            return [...this.bankCardService.sortCards(cards)];
          }
          return cards;
        });
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
        this.allDestinationCards.update((cards) => {
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
