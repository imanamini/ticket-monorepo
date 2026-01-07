import { Injectable, signal, WritableSignal } from '@angular/core';
import { CardPreviewConfigInterface } from '../models/card-preview-config.interface';
import { Bank } from '../models/bank.interface';
import { BankCard, ServiceType } from "../models/card-api.interface";

@Injectable({
  providedIn: 'root',
})
export class BankCardService {
  card = signal<CardPreviewConfigInterface | null>(null);

  findBankByCardPrefix(banks: Array<Bank>, cardNumber: string): Bank | null {
    cardNumber = cardNumber.replace(' ', '');
    if (cardNumber.length >= 6) {
      const bank = banks.find((bnk) => {
        const prefix = bnk.cardPrefixes.find((prefix) => {
          return cardNumber.startsWith(prefix);
        });
        return !!prefix;
      });
      return bank ?? null;
    }
    return null;
  }

  mapApiCardsToClientCards(cards: BankCard[], isDestination = false): Array<WritableSignal<CardPreviewConfigInterface>> {
    return cards.map((card) => {
      const clientCard: CardPreviewConfigInterface = {
        id: card.cardIndex,
        bankName: card.alias ?? card.bankName,
        cardNumber: card.pan,
        bankLogoId: card.bankLogoImageId,
        isDestination: isDestination,
        isPinned: card.pinned,
        baseColor: `#${card.colorRange[0]}`,
        ownerName: card.cardOwner,
        expDate: card.expireDate,
        isMinimized: true,
        prefix: card.prefix,
        postfix: card.postfix,
        attachedServiceType: card.attachedServiceType,
        alias: card.attachedServiceType?.find((item)=> item === ServiceType.POS_PAYMENT) ? 'متصل به اعتبار دیجی‌پی' : ''
      };
      return signal(clientCard);
    });
  }

  getCardPanPrefix(cardNumber: string): string {
    return cardNumber.slice(0, 6);
  }

  getCardPanPostfix(cardNumber: string): string {
    return cardNumber.slice(-4);
  }

  sortCards(cards: WritableSignal<CardPreviewConfigInterface>[]): WritableSignal<CardPreviewConfigInterface>[] {
    return cards.sort((c1, c2) => {
      if (c1().isPinned === c2().isPinned) {
        return 0;
      } else if (c1().isPinned && !c2().isPinned) {
        return -1;
      } else {
        return 1;
      }
    });
  }
}
