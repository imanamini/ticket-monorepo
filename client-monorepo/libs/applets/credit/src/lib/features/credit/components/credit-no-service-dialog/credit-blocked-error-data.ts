import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';

export interface CreditBlockedErrorData {
  title: string;
  message: string;
  staticImage: 'no-service' | 'error' | 'warning' | 'in-progress' | 'failed';
  primaryCta: string;
  secondaryCta: string;
  buttons?: Buttons[];
  pageTitle?: string;
  notBlocker?: boolean;
}
