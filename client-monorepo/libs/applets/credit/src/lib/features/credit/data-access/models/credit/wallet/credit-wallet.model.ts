import { SERVICE_TYPE } from '../service-type/service-type.model';
import { CUSTOMER_TYPE } from '../installment/customer-type';

export interface CreditWallet {
  type: 'WALLET' | 'VOLUNTEER';
  title: string;
  status: CREDIT_WALLET_STATUS;
  fundProviderCode: number;
  icon: string;
  balance: number;
  color: string;
  installmentCount: number;
  description: string;
  mainLabel: string;
  leftLabel: Alias;
  rightLabel: Alias;
  creditId: string;
  redirectUrl?: string;
  serviceType: SERVICE_TYPE;
  customerType: CUSTOMER_TYPE;
  topCardTitle?: string;
  accountStatus?: AccountStatus;
}

export enum AccountStatus {
  ACTIVE = 0,
  CLOSE = 1,
  IN_ACTIVE = 2,
  BLOCK = 3,
}

export interface Alias {
  value: string;
  textColor?: string;
  backgroundColor?: string;
  imageId?: any;
}

export enum CREDIT_WALLET_STATUS {
  INACTIVE = 0,
  START_ACTIVATION = 1,
  IN_PROGRESS = 2,
  EXPIRED = 3,
  OPERATION_PROCESS = 4,
  COMPLETED = 6,
  PRE_REGISTERED = 7,
  READY_TO_CLOSE = 8,
  CLOSE = 9,
  CLOSE_REJECTED = 10,
  CLOSE_CONTRADICTED = 11,
}
