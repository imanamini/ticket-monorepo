import { ApiResultInterface } from '@client-monorepo/common/network';
import { ProductInterface } from './product.interface';

export type ProductSearchApiResponse = {
  result: ApiResultInterface;
  products: ProductInterface[];
  queryId: string;
};
