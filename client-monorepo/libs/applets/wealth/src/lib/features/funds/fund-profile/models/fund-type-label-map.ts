import { FundsType } from '../../../../components/core/models/fund-schemas/types';

export const FundTypeLabelMap: Partial<Record<FundsType, string>> = {
  FixedIncome: 'درامد ثابت',
  Gold: 'مبتنی بر طلا',
  Index: 'شاخصی',
  Stock: 'سهامی',
};
