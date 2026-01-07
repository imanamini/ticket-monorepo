import { StoredCard } from '../credit/installment-pay-link/services/dpg/card/models/stored-card.model';
import { CardProfile } from '../credit/installment-pay-link/services/dpg/card/models/card-profile-response.model';

export function makeMaskForStoredCard(card: StoredCard): StoredCard {

  // let pan = card.prefix + 'xxxxxx' + card.postfix;
  //
  // card.pan = pan.trim().replace(/(.{4})(.{4})(.{4})(.{4})/ig, '$1-$2-$3-$4');

  return card;
}

export function getReformPan(cardNumber: string): string {
  const pan = cardNumber;
  const reformPan = pan.match(/.{1,4}/g);
  return reformPan.join(' ');
}

export function getCardPanPrefix(cardNumber: string): string {
  return cardNumber.substr(0, 6);
}

export function getCardPanPostfix(cardNumber: string): string {
  return cardNumber.slice(-4);
}

export function removePanDashes(pan: string): string {
  return pan.replace(/-/ig, '');
}

export function convertStoredCardToCardProfile(card: StoredCard): CardProfile {
  card = makeMaskForStoredCard(card);
  return {
    pan: card.pan,
    cardHolder: card.cardOwner,
    bankName: card.alias,
    colorRange: card.colorRange,
    logoImageId: card.logoImageId,
    patternImageId: card.imageId,
    expirationDate: card.expireDate,
  } as CardProfile;
}
