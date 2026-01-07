import { ApiResultInterface } from '@client-monorepo/common/network';
import { BankCard, BlankCard } from '@client-monorepo/daily-fintech/bank-card';

export interface SearchCardsResponseInterface extends ApiResultInterface {
  cards: Array<BankCard>;
  defaultCard: BlankCard;
  newCard: BlankCard;
  hasNext: boolean;
}
