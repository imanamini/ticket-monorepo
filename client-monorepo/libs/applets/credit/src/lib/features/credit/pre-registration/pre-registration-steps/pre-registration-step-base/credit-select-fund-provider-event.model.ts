import { CreditFundProviderGroupCardModel } from '../../components/credit-fund-provider-groups-card/credit-fund-provider-group-card.model';

export type CreditSelectFundProviderEventModel = {
  fundProviderCode: number;
  allocationPrepaymentAmount: number;
} & Pick<CreditFundProviderGroupCardModel, 'collaterals' | 'userEntryPoint'>;
