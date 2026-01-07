import { FundsType } from '../../../../components/core/models/fund-schemas';

export interface IFundProfitDetail {
  title: string;
  value: string;
}

export interface IProfileGeneralInfo {
  key: string;
  value: string | number;
  title: string;
  fundType: FundsType;
}
