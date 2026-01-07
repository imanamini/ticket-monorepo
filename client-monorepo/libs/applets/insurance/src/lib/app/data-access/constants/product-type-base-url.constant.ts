import { InsuranceProductTypeEnum } from '../enums/Insurance-product-type.enum';
import { INSURANCE_APP_PREFIX } from './insurance-app-prefix.constant';

export const PRODUCT_TYPE_BASE_URL = {
  [InsuranceProductTypeEnum.ThirdParty]: INSURANCE_APP_PREFIX + '/vehicle/third-party/',
  [InsuranceProductTypeEnum.ThirdPartyMotor]: INSURANCE_APP_PREFIX + '/vehicle/third-party-motor/',
  [InsuranceProductTypeEnum.Body]: INSURANCE_APP_PREFIX + 'vehicle/body/',
  [InsuranceProductTypeEnum.HouseIncidents]: INSURANCE_APP_PREFIX + 'house-incidents',
};
