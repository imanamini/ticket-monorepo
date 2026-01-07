import { OrderStatus } from '../../../data-access/enums/order-status';

export interface IIPOProfile {
  coverLogoAddress?: string;
  thumbnailLogoAddress?: string;
  symbol?: string;
  displaySymbol?: string;
  companyFullName?: string;
  market?: string;
  volume?: string;
  volumePerIndiviual?: string;
  date?: string;
  title?: string;
  price?: number;
  bioItems?: string[];
  status?: EIPOStatus;
  transactionId?: string;
  transactionStatus?: OrderStatus;
  paymentMethod?: string;
  openNotifyMe?: boolean;
}

export enum EIPOStatus {
  PreOrderRegistered = 'PreOrderRegistered',
  PreOrderNotRegistered = 'PreOrderNotRegistered',
  FinishedRegistered = 'FinishedRegistered',
  FinishedNotRegistered = 'FinishedNotRegistered',
}
