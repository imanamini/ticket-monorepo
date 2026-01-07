import { InsuranceTabModel } from '../../../../data-access/models/insurance-tab.model';
import { InsuranceTabEnum } from '../enums/policy-list.enum';

export const TABS: InsuranceTabModel[] = [
  {
    title: 'شخص ثالث',
    icon: 'car',
    value: InsuranceTabEnum.THIRD_PARTY
  },
  {
    title: 'بدنه',
    value: InsuranceTabEnum.CAR_BODY,
    icon: 'car-crash'
  },
  {
    title: 'تجهیزات دیجیتال',
    value: InsuranceTabEnum.DIGITAL_EQUIPMENT,
    icon: 'digital-device'
  },
  {
    title: 'شخص ثالث موتور',
    value: InsuranceTabEnum.THIRD_PARTY_MOTOR,
    icon: 'motor'
  },
  {
    title: 'خانه',
    value: InsuranceTabEnum.HOUSE_INCIDENT,
    icon: 'home'
  }
];

