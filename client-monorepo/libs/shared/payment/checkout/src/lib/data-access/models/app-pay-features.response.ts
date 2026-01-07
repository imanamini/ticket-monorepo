import { APP_ACTIONS } from '@client-monorepo/common/action-handler';
import { TGS_PROTECTION_STATE } from './tgs-protection-state.enum';
import { ApiResultInterface } from '@client-monorepo/common/network';
import { TransactionType } from '@client-monorepo/payment/transactions';
import { TicketInfoStatus } from './ticket-info-status.enum';
import { TicketTypes } from '@client-monorepo/payment/purchase';

export interface AppPayFeaturesResponse {
  amount: number;
  callbackUrl?: string;
  fallbackUrl?: string;
  features: Array<TicketInfoFeature>;
  providerId: string;
  result: ApiResultInterface;
  type: string | TicketTypes;
  redirectUrl?: string;
  ttl: number;
}

export type FeatureName = `${APP_ACTIONS}`;

export interface TicketInfoFeature {
  badge?: Badge;
  ActionButton?: ActionButton;
  callbackFeature?: TicketInfoFeature;
  description: string;
  name: FeatureName;
  order: number;
  protectionState: TGS_PROTECTION_STATE;
  status: TicketInfoStatus;
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
  creditId?: string;
  redirectToCustomPayUrl?: boolean;
  quick: boolean;
  method: FeatureName; // client side property
  bpgMode?: BPG_PAYMENT_MODE;
}

export enum BPG_PAYMENT_MODE {
  BPG_1PAY = 0,
  BPG_4PAY = 1,
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
