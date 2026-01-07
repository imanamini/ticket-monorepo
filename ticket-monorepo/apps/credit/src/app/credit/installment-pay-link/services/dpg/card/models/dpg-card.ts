export interface DpgDynamicPasswordRequest {
  amount: number;
  certFile: string;
  pan: DpgCardPanDto;
  transactionType: number;
}

export interface DpgCardPanDto {
  expireDate: string;
  type: number;
  value: string;
  postfix?: string;
  prefix?: string;
}
