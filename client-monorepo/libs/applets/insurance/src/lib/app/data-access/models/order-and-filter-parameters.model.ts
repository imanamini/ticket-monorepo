import { OrderModel } from './order.model';
import { RestrictionModel } from './restriction.model';

export interface OrderAndFilterParametersModel {
  orders: OrderModel[];
  restrictions: RestrictionModel[];
}
