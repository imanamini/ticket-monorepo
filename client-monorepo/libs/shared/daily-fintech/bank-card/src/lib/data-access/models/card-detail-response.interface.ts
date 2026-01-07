import { ApiResultInterface } from '@client-monorepo/common/network';
import { BankCard } from '@client-monorepo/daily-fintech/bank-card';

export interface CardDetailResponseInterface extends ApiResultInterface {
  card: BankCard;
}
