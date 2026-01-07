export interface PreRegisterRequest {
  nationalCode: string;
  birthDate: number;
  planId: string;
  groupId?: string;
  organizationId?: string;
  balance?: number;
  cartReservationRequest?: CartReservationRequest | null;
  merchant?: MerchantType;
}

export interface CartReservationRequest {
  orderId: string;
  amount: number;
}

export enum MerchantType {
  'NO_MERCHANT' = -1,
  'DIGIKALA' = 0,
  'PILLAR' = 1,
}
