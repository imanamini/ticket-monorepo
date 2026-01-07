import { CardCheckResponse } from './card-check-response.interface';
import { CardDefinition } from './card-definition.interface';

export interface CardVerifyData {
  cardCheckResponse: CardCheckResponse;
  srcCard: CardDefinition;
  destCard: CardDefinition;
  amount: number;
  nationalCode?: string;
}
