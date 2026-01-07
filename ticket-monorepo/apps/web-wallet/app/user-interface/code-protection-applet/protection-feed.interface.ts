import { PasswordType } from './password-type';

export interface ProtectionFeed {
  amount?: number;
  walletBalance: number;
  protection: PasswordType;
  userDetail?: {
    userId: string;
    cellNumber: string;
    active: boolean
  };
  features?: number[];
  showSubscriptionMessages?: boolean;
  googleAnalyticId?: {
    wrapperId: string;
  };
}
