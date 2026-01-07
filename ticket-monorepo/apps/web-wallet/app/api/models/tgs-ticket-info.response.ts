import { ApiResult } from './api-result';
import { TransactionType } from '../emuns/tgs-ticket-info-transaction-type';
import { TGS_PROTECTION_STATE } from '../emuns/tgs-protection-state.enum';
import { UpgFeatureName } from '../emuns/upg-feature-name.emun';
import { TicketType } from '../emuns/ticket-type.emun';

export interface TgsTicketInfoResponse {
  amount: number;
  callbackUrl?: string;
  fallbackUrl?: string;
  features: Array<TicketInfoFeature>;
  providerId: string;
  result: ApiResult;
  type: string | TicketType;
  redirectUrl?: string;
  ttl: number;
}

export interface TicketInfoFeature {
  badge?: Badge;
  ActionButton?: ActionButton;
  callbackFeature?: TicketInfoFeature;
  description: string;
  name: UpgFeatureName;
  order: number;
  protectionState: TGS_PROTECTION_STATE;
  status: string;
  title: string;
  visible: boolean;
  transactionType?: TransactionType;
  selectedIcon: string;
  icon: string;
  selectedColor: string;
  amount?: number;
  payUrl?: string;
  redirectUrl?: string;
  result?: any;
  walletBalance?: number;
  cashInDefaultValue?: number;
  cashInDefaults?: Array<number>;
  cashInXferMax?: number;
  cashInXferMin?: number;
  rawAmount?: number;
  isPreferredGateway: boolean;
}

export interface Badge {
  backgroundColor: string;
  borderColor: string;
  message: string;
  textColor: string;
  value: string;
}

export interface ActionButton {
  backgroundColor: string;
  borderColor: string;
  message: string;
  textColor: string;
  value: string;
  actionUrl: string;
}
