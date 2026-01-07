import { APP_ACTIONS } from '@client-monorepo/common/action-handler';
import { TicketTypes } from '@client-monorepo/payment/purchase';

export interface TgsSelectFeatureBody {
  ticket: string;
  featureName: APP_ACTIONS;
  type: TicketTypes;
}
