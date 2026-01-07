import { ActionType } from './action-type';
import { RedirectPayload } from './action-payload';
import { OldActionPayload } from './old-action-payload';
import { GoToServicePayload } from './go-to-service-payload';
import { GoToC2cPayload } from './go-to-c2c-payload';
import { PayInstallmentPayload } from './pay-installment-payload';
import { DiscountPlpPayload } from './discount-plp-payload';

export type Action = RedirectAction | OldAction | GoToServiceAction | GoToC2CAction | PayInstallmentAction | GoToDiscountPLPAction;

export type RedirectAction = {
  type: ActionType.REDIRECT;
  payload: RedirectPayload;
};

export type OldAction = {
  type: ActionType.OLD_ACTION;
  payload: OldActionPayload;
};

export type GoToServiceAction = {
  type: ActionType.GO_TO_SERVICE;
  payload: GoToServicePayload;
};

export type GoToC2CAction = {
  type: ActionType.GO_TO_C2C;
  payload: GoToC2cPayload;
};

export type PayInstallmentAction = {
  type: ActionType.PAY_INSTALLMENT;
  payload: PayInstallmentPayload;
};

export type GoToDiscountPLPAction = {
  type: ActionType.GO_TO_Discount_PLP;
  payload: DiscountPlpPayload;
};
