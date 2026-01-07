import { ApiResponse } from '../../../../api/api-response.model';

export interface ValidateCouponPayload {
  couponCode: string;
  creditId: string;
}

export interface ValidateCouponResponse extends ApiResponse {
  amount: number;
  couponAmount: number;
  finalAmount: number;
}

export interface CouponModel {
  couponCode: string;
  amount: number;
  couponAmount: number;
  finalAmount: number;
}
