import { ActionType } from './action-type';
import { RedirectPayload } from './action-payload';

export type Action = RedirectAction;

export type RedirectAction = {
  type: ActionType.REDIRECT;
  payload: RedirectPayload;
};
