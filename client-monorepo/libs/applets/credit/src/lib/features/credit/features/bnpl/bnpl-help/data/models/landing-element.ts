export enum LANDING_ELEMENT_TYPE {
  LINK_CARDS,
  SMALL_TEXT,
  ICON_CARD_STEPS,
  ALERT_BOX,
  TEXT_CARD_STEPS,
  TEXT_CARD,
  IMAGE,
  STORES,
}

interface LandingElementBase<T, P> {
  type: T;
  payload: P;
}

export interface LandingElementLinkCardsPayload {
  cards: {
    image: string;
    title: string;
    link: string;
  }[];
}

export interface LandingElementSmallTextPayload {
  text: string;
}

export interface LandingElementIconCardStepsPayload {
  steps: {
    icon: string;
    title: string;
  }[];
}

export interface LandingElementAlertBoxPayload {
  icon: string;
  description: string;
}

export interface LandingElementTextCardStepsPayload {
  steps: {
    description: string;
  }[];
}

export interface LandingElementTextCardPayload {
  image: string;
  description: string;
}

export interface LandingElementImagePayload {
  image: string;
}

export interface LandingElementStorePayload {}

export type LandingElementLinkCards = LandingElementBase<LANDING_ELEMENT_TYPE.LINK_CARDS, LandingElementLinkCardsPayload>;
export type LandingElementSmallText = LandingElementBase<LANDING_ELEMENT_TYPE.SMALL_TEXT, LandingElementSmallTextPayload>;
export type LandingElementIconCardSteps = LandingElementBase<LANDING_ELEMENT_TYPE.ICON_CARD_STEPS, LandingElementIconCardStepsPayload>;
export type LandingElementAlertBox = LandingElementBase<LANDING_ELEMENT_TYPE.ALERT_BOX, LandingElementAlertBoxPayload>;
export type LandingElementTextCardSteps = LandingElementBase<LANDING_ELEMENT_TYPE.TEXT_CARD_STEPS, LandingElementTextCardStepsPayload>;
export type LandingElementTextCard = LandingElementBase<LANDING_ELEMENT_TYPE.TEXT_CARD, LandingElementTextCardPayload>;
export type LandingHelpElementImage = LandingElementBase<LANDING_ELEMENT_TYPE.IMAGE, LandingElementImagePayload>;
export type LandingHelpElementStore = LandingElementBase<LANDING_ELEMENT_TYPE.STORES, LandingElementStorePayload>;

export type LandingElement =
  | LandingElementLinkCards
  | LandingElementSmallText
  | LandingElementIconCardSteps
  | LandingElementAlertBox
  | LandingElementTextCardSteps
  | LandingElementTextCard
  | LandingHelpElementImage
  | LandingHelpElementStore
  | undefined;
