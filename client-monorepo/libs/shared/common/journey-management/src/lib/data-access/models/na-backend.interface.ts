import { ApiResult } from '@digipay/ngx-payment-result';
import { JourneyManagerActions } from './jm.enums';

export type NextActionApiResult = {
  result: ApiResult;
  nextActions: NextAction[];
};

export interface NextAction {
  id?: string;
  type: NextActionType;
  source: NextActionSource;
  positions?: Array<NextActionPosition>;
  recommendationScore: number;
  payload: NextActionPayload;
}

export enum NextActionType {
  SIMPLE = 0,
  ERROR = 1,
  UPCOMING = 2,
}

export enum NextActionSource {
  DPX = 0,
  CREDIT_REGISTRATION = 1,
  INSTALLMENT = 2,
  CREDIT_PURCHASE = 3,
}

export enum NextActionState {
  BEFORE = 0,
  IN_PROGRESS = 1,
  AFTER = 2,
  RETURN = 3,
}

export enum NextActionStatus {
  CONTINUE = 0,
  PENDING = 1,
  BLOCKED = 2,
}

export enum NextActionPosition {
  TOP = 0,
  BOTTOM = 1,
}

export interface NextActionPayload {
  title: string;
  subTitle: string;
  description: string;
  state: NextActionState;
  status: NextActionStatus;
  graphic: NextActionGraphic;
  primaryAction: Action;
  secondaryActions: Array<Action>;
}

export interface Action {
  actionType: JourneyManagerActions;
  actionData?: any;
}

export interface NextActionGraphic {
  type: GraphicType;
  totalStep?: number;
  currentStep?: number;
  fileId?: string;
  foreground?: string;
  background?: string;
}

export enum GraphicType {
  PICTURE = 0,
  GAUGE_CHART = 1,
}

export type DisplayState = 'pending' | 'hidden' | 'visible';

export type NextActionWithState = NextAction & { displayState: DisplayState };
