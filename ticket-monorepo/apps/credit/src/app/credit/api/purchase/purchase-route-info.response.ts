import { ApiResponse } from '../api-response.model';

export type PurchaseRouteAction = 'LOADING' | 'MIDDLE_PAGE' | 'ERROR';

export interface PurchaseRouteInfoResponse extends ApiResponse {
  action: PurchaseRouteAction;
  redirectUrl: string;
  delay: number;
  title: string | null;
  mainLabel: string | null;
  message?: {
    text: string
  };
}
