import { SimTypeConfig } from '../models/mobile-operator.model';
import { buildSimTypeConfig } from '../../utils/simType-config-builder';

enum CellNumberType {
  POST_PAID = 1,
  PRE_PAID = 2,
  DATA = 3,
  TD_LTE = 4,
}

const SimTypeMapper: Record<number, string> = {
  [CellNumberType.POST_PAID]: 'دائمی',
  [CellNumberType.PRE_PAID]: 'اعتباری',
  [CellNumberType.DATA]: 'دیتا',
  [CellNumberType.TD_LTE]: 'TD-LTE',
};

enum OperatorEnum {
  MCI = '1',
  MTN = '2',
  RIGHTEL = '3',
  SHATEL = '4',
}

export const iconMapper: Record<CellNumberType, string> = {
  [CellNumberType.POST_PAID]: 'Mobile',
  [CellNumberType.PRE_PAID]: 'Receipt-bill',
  [CellNumberType.DATA]: 'network',
  [CellNumberType.TD_LTE]: 'email',
};
export enum ServiceType {
  internet = 'internet',
  charge = 'charge',
}
export const OperatorSimTypeConfig: Record<OperatorEnum, Record<ServiceType, SimTypeConfig[]>> = {
  [OperatorEnum.MCI]: {
    internet: buildSimTypeConfig([CellNumberType.PRE_PAID, CellNumberType.POST_PAID], SimTypeMapper, iconMapper),
    charge: buildSimTypeConfig([CellNumberType.POST_PAID, CellNumberType.PRE_PAID, CellNumberType.DATA], SimTypeMapper, iconMapper),
  },
  [OperatorEnum.MTN]: {
    internet: buildSimTypeConfig([CellNumberType.PRE_PAID, CellNumberType.POST_PAID, CellNumberType.TD_LTE], SimTypeMapper, iconMapper),
    charge: buildSimTypeConfig([CellNumberType.POST_PAID, CellNumberType.PRE_PAID, CellNumberType.DATA], SimTypeMapper, iconMapper),
  },
  [OperatorEnum.RIGHTEL]: {
    internet: buildSimTypeConfig([CellNumberType.PRE_PAID, CellNumberType.POST_PAID], SimTypeMapper, iconMapper),
    charge: buildSimTypeConfig([CellNumberType.POST_PAID, CellNumberType.PRE_PAID, CellNumberType.DATA], SimTypeMapper, iconMapper),
  },
  [OperatorEnum.SHATEL]: {
    internet: buildSimTypeConfig([CellNumberType.PRE_PAID, CellNumberType.DATA], SimTypeMapper, iconMapper),
    charge: buildSimTypeConfig([CellNumberType.PRE_PAID], SimTypeMapper, iconMapper),
  },
};
export const OPERATOR_TYPES_CONFIG = [
  { key: '1', value: 'دائمی', icon: 'Mobile', iconColor: '#0F53ED' },
  { key: '2', value: 'اعتباری', icon: 'Receipt-bill', iconColor: '#0F53ED' },
  { key: '3', value: 'دیتا', icon: 'email', iconColor: '#0F53ED' },
];
