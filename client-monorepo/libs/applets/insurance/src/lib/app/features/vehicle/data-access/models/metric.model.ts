import { InsuranceProductTypeEnum } from '../../../../data-access/enums/Insurance-product-type.enum';

export interface MetricModel {
  name: string;
  route?: string;
  lastRoute?: string;
  lastName?: string;
  metadata?: MetricMatadataModel[];
  userId?: string;
  guid: string;
  productType: InsuranceProductTypeEnum;
}

export interface MetricMatadataModel {
  key: string;
  value: string;
}
