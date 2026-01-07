import { InsuranceProductTypeEnum } from '../../../../../../data-access/enums/Insurance-product-type.enum';

export const PRODUCT_ICON_MAP = {
  [InsuranceProductTypeEnum.ThirdParty]: 'car-2',
  [InsuranceProductTypeEnum.ThirdPartyMotor]: 'motor',
  [InsuranceProductTypeEnum.Body]: 'car-crash',
  [InsuranceProductTypeEnum.HouseIncidents]: 'building',
  [InsuranceProductTypeEnum.Equipment]: 'digital-device'
};
