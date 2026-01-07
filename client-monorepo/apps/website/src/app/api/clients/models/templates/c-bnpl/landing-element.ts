import { ApiFile } from '../../common/api-file';

export enum LANDING_ELEMENT_TYPE {
  // LINK_CARD,
  // SMALL_TEXT,
  // ICON_CARD_STEPS,
  ALERT_BOX,
  TEXT_CARD_STEPS,
  TEXT_CARD,
  ALERT_BOX_EXTENDED,
  // IMAGE
  TEXT_SIMPLE_ITEMS,
}

interface LandingElementBase<T, P> {
  type: T;
  payload: P;
}

export interface LandingElementLinkCardPayload {
  image: string;
  title: string;
  link: string;
}

export interface LandingElementSmallTextPayload {
  text: string;
}

export interface LandingElementIconCardStepsPayload {
  steps: {
    icon: ApiFile;
    title: string;
  }[];
}

export interface LandingElementAlertBoxPayload {
  icon: ApiFile;
  steps: {
    title: string;
    description: string;
  }[];
}

export interface LandingElementAlertBoxExtendedPayload {
  icon: ApiFile;
  steps: {
    title: string;
    description: string;
  }[];
}

export interface LandingElementTextCardStepsPayload {
  steps: {
    description: string;
  }[];
}

export interface LandingElementTextCardPayload {
  icon: ApiFile;
  steps: {
    description: string;
  }[];
}

export interface LandingElementImagePayload {
  image: ApiFile;
}

// export type LandingElementLinkCard = LandingElementBase<LANDING_ELEMENT_TYPE.LINK_CARD, LandingElementLinkCardPayload>;
// export type LandingElementSmallText = LandingElementBase<LANDING_ELEMENT_TYPE.SMALL_TEXT, LandingElementSmallTextPayload>;
// export type LandingElementIconCardSteps = LandingElementBase<LANDING_ELEMENT_TYPE.ICON_CARD_STEPS, LandingElementIconCardStepsPayload>;
export type LandingElementAlertBox = LandingElementBase<LANDING_ELEMENT_TYPE.ALERT_BOX, LandingElementAlertBoxPayload>;
export type LandingElementTextCardSteps = LandingElementBase<LANDING_ELEMENT_TYPE.TEXT_CARD_STEPS, LandingElementTextCardStepsPayload>;
export type LandingElementTextCard = LandingElementBase<LANDING_ELEMENT_TYPE.TEXT_CARD, LandingElementTextCardPayload>;
// export type LandingHelpElementImage = LandingElementBase<LANDING_ELEMENT_TYPE.IMAGE, LandingElementImagePayload>;
export type LandingElementAlertBoxExtended = LandingElementBase<
  LANDING_ELEMENT_TYPE.ALERT_BOX_EXTENDED,
  LandingElementAlertBoxExtendedPayload
>;
export type LandingElement =
  // LandingElementLinkCard |
  // LandingElementSmallText |
  // LandingElementIconCardSteps |
  LandingElementAlertBox | LandingElementTextCardSteps | LandingElementTextCard | LandingElementAlertBoxExtended;
// |
// LandingHelpElementImage;
