import { CreditFundProviderGroupCardModel } from './credit-fund-provider-group-card.model';

export type CreditSelectFundProviderEventModel = {
  fundProviderCode: number;
  allocationPrepaymentAmount: number;
} & Pick<CreditFundProviderGroupCardModel, 'collaterals'>;
