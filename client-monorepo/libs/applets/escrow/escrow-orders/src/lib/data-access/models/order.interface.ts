import { ApiResultInterface } from '@client-monorepo/common/network';

export interface OrderFilterRequest {
  page: number;
  size: number;
  restrictions?: OrdersFilterRestrictionsRequest[];
  orders?: OrdersSortRequest[];
}

export interface OrdersResponse {
  result: ApiResultInterface;
  orders: OrderResponse[];
}

export interface OrdersFilterRestrictionsRequest {
  field: string;
  type: string;
  values: any[] | any;
  operation?: string;
}

export interface OrdersSortRequest {
  field: string;
  order: string;
}

export interface OrderResponse {
  announcementTitle: string;
  state: number;
  price: number;
  paidAmount: number;
  creationDate: number;
  trackingCode: string;
  image: string;
  remainingDate?: number;
  type?: string;
  postTrackingCode?: string;
  courierCellNumber?: string;
  courierFullName?: string;
  description?: string;
  buyerCellNumber?: string;
}
