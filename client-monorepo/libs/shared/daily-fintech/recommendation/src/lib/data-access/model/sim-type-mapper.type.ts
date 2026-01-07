import { CellNumberType } from './cell-number-type.model';

export const SimTypeMapper: Record<number, string> = {
  [CellNumberType.POST_PAID]: 'دائمی',
  [CellNumberType.PRE_PAID]: 'اعتباری',
  [CellNumberType.DATA]: 'دیتا',
  [CellNumberType.TD_LTE]: 'TD-LTE',
};
