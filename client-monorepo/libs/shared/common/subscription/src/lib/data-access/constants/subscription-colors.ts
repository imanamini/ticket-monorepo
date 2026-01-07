import { PLANS_TYPE } from '../models/plans-type.model';

export const SubscriptionColors = [
  {
    type: PLANS_TYPE.PLATINUM,
    bgColor: '#DCF1F8',
    progressColor: '#16A1D3',
    diamondColor: '#95D4EA',
  },
  {
    type: PLANS_TYPE.GOLD,
    bgColor: '#FFF3CC',
    progressColor: '#FEc003',
    diamondColor: '#FFE07A',
  },
  {
    type: PLANS_TYPE.SILVER,
    bgColor: '#E6E7EF',
    progressColor: '#898CA4',
    diamondColor: '#B7BAD1',
  },
  {
    type: PLANS_TYPE.BRONZE,
    bgColor: '#F9E1D2',
    progressColor: '#D27438',
    diamondColor: '#F3C3A5',
  },
  {
    type: PLANS_TYPE.PAY_PLUS,
    bgColor: '#FFEBEB',
    progressColor: '#F96079',
    diamondColor: '#FFCAD3',
  },
  {
    type: PLANS_TYPE.PAY_PRO,
    bgColor: '#ECF5FD',
    progressColor: '#68B0FB',
    diamondColor: '#DAEAFE',
  },
];
