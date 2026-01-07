import { CardActionStatus } from './card-action-status.interface';
import { CardActionPayload } from './card-action.payload.interface';

export interface CardActionButton {
  imageId?: string;
  value: string;
  textColor: string;
  status: CardActionStatus;
  featureName?: string;
  payload?: CardActionPayload;
  insiderEvent?: string;
  fireBaseEvent?: string;
}
