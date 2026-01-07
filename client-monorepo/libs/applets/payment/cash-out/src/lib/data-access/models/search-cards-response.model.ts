import { ApiResultInterface } from '@client-monorepo/common/network';
import { StoredCard } from './stored-card.model';
import { BlankCard } from '@client-monorepo/daily-fintech/bank-card';

export interface SearchCardsResponse {
  result: ApiResultInterface;
  cards: Array<StoredCard>;
  defaultCard: BlankCard;
  newCard: BlankCard;
  hasNext: boolean;
}
