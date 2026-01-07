import { InsuranceProductTypeEnum } from '../../../../../../data-access/enums/Insurance-product-type.enum';

export interface PolicyFilterOptionModel {
  isChecked: boolean;
  title: string;
  value: InsuranceProductTypeEnum;
}
