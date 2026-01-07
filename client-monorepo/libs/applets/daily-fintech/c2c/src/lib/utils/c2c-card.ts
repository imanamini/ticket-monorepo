import { BankCard, CardPanDto, CardType } from '@client-monorepo/daily-fintech/bank-card';
import { convertNonEnglishDigits, toPersianChar } from '@digipay/strings';
import { CardRegistration } from '../data-access/models/card-registration.enum';
import { JSEncrypt } from 'jsencrypt';

export class C2cCardHelper {
  static removeDuplicates(cards: BankCard[]): BankCard[] {
    const cardMap = new Map<string, BankCard>(cards.map((card) => [card.pan, card]));
    return Array.from(cardMap.values());
  }

  static filterBySearch(cards: BankCard[], keyword: string): BankCard[] {
    if (!keyword.trim()) return [...cards];

    const normalizedKeyword = convertNonEnglishDigits(toPersianChar(keyword.trim()));
    const searchFields: (keyof BankCard)[] = ['pan', 'cardOwner', 'alias', 'bankName'];

    return cards.filter((card) =>
      searchFields.some((field) => {
        const value = card[field];
        if (!value) return false;
        const normalizedValue = convertNonEnglishDigits(toPersianChar(value as string));
        return normalizedValue.includes(normalizedKeyword);
      }),
    );
  }

  static shouldBeRegistered(card: BankCard, cardType: 'source' | 'destination' = 'source'): boolean {
    if (cardType === 'destination') return false;
    return card?.externalRegistrationMode !== CardRegistration.IGNORE;
  }

  static removePanDashes(pan: string): string {
    return pan.replace(/-/gi, '');
  }

  static makeCardDtoForOtp(card: BankCard, certFile?: string): CardPanDto {
    let value = card.cardIndex || '';
    let type = CardType.INDEX;

    if (!value && certFile) {
      const encrypt = new JSEncrypt();
      encrypt.setPublicKey(certFile);
      value = encrypt.encrypt(card?.pan) as string;
      type = CardType.ENCRYPTED;
    }
    return {
      expireDate: card.expireDate,
      prefix: card.prefix,
      postfix: card.postfix,
      type,
      value,
    };
  }
}
