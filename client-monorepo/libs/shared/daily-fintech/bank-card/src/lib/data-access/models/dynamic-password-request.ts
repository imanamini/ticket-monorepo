export interface DynamicPasswordRequest {
  amount: number;
  certFile: string;
  pan: CardPanDto;
  targetPan?: CardPanDto;
  transactionType: number;
}

export interface CardPanDto {
  expireDate?: string;
  type: string | number;
  value: string;
  postfix: string;
  prefix: string;
}
