import { PagedApiResultInterface } from '@client-monorepo/common/network';
import { ProductFacetInterface } from './product-facet.interface';
import { ProductInterface } from './product.interface';

export interface ProductListResponseInterface extends PagedApiResultInterface {
  products: Array<ProductInterface>;
  facets: Array<ProductFacetInterface>;
  queryId: string;
}
