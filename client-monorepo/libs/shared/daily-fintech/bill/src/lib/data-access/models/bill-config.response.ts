import { ApiResultInterface } from '@client-monorepo/common/network';
import { BillTypeModel } from './bill-type.model';

export interface BillConfigResponse {
  result: ApiResultInterface;
  icons: Array<{
    title: string;
    imageId: string;
  }>;

  configs: Array<BillTypeModel>;
}
