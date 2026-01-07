import { ApiFile } from '../../common/api-file';

export interface CBnplVoucherTemplateData {
  code: string;
  discountText: string;
  expirationDate: string;
  icon: ApiFile;
  name: string;
  websiteUrl: string;
}
