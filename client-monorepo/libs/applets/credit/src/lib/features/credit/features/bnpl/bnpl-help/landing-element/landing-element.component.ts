import { Component, input } from '@angular/core';
import {
  LANDING_ELEMENT_TYPE,
  LandingElement,
  LandingElementAlertBoxPayload,
  LandingElementIconCardStepsPayload,
  LandingElementImagePayload,
  LandingElementLinkCardsPayload,
  LandingElementSmallTextPayload,
  LandingElementStorePayload,
  LandingElementTextCardPayload,
  LandingElementTextCardStepsPayload,
} from '../data/models/landing-element';
import { LandingElementAlertBoxComponent } from './landing-element-alert-box/landing-element-alert-box.component';
import { LandingElementIconCardStepsComponent } from './landing-element-icon-card-steps/landing-element-icon-card-steps.component';
import { LandingElementSmallTextComponent } from './landing-element-small-text/landing-element-small-text.component';
import { LandingElementTextCardComponent } from './landing-element-text-card/landing-element-text-card.component';
import { LandingElementTextCardStepsComponent } from './landing-element-text-card-steps/landing-element-text-card-steps.component';
import { LandingElementImageComponent } from './landing-element-image/landing-element-image.component';
import { LandingElementLinkCardsComponent } from './landing-element-link-cards/landing-element-link-cards.component';
import { LandingElementStoresComponent } from './landing-element-stores/landing-element-stores.component';

@Component({
  selector: 'ui-landing-element',
  templateUrl: './landing-element.component.html',
  styleUrls: ['./landing-element.component.scss'],
  standalone: true,
  imports: [
    LandingElementAlertBoxComponent,
    LandingElementIconCardStepsComponent,
    LandingElementSmallTextComponent,
    LandingElementTextCardComponent,
    LandingElementTextCardStepsComponent,
    LandingElementImageComponent,
    LandingElementLinkCardsComponent,
    LandingElementStoresComponent,
  ],
})
export class LandingElementComponent {
  element = input<LandingElement>();
  BNPL_HELP_ELEMENT_TYPE = LANDING_ELEMENT_TYPE;

  getAlertBoxPayload(): LandingElementAlertBoxPayload | undefined {
    const el = this.element();
    if (el?.type === LANDING_ELEMENT_TYPE.ALERT_BOX) {
      return el.payload as LandingElementAlertBoxPayload;
    }
    return undefined;
  }

  getIconCardStepsPayload(): LandingElementIconCardStepsPayload | undefined {
    const el = this.element();
    if (el?.type === LANDING_ELEMENT_TYPE.ICON_CARD_STEPS) {
      return el.payload as LandingElementIconCardStepsPayload;
    }
    return undefined;
  }

  getImagePayload(): LandingElementImagePayload | undefined {
    const el = this.element();
    if (el?.type === LANDING_ELEMENT_TYPE.IMAGE) {
      return el.payload as LandingElementImagePayload;
    }
    return undefined;
  }

  getLinkCardsPayload(): LandingElementLinkCardsPayload | undefined {
    const el = this.element();
    if (el?.type === LANDING_ELEMENT_TYPE.LINK_CARDS) {
      return el.payload as LandingElementLinkCardsPayload;
    }
    return undefined;
  }

  getSmallTextPayload(): LandingElementSmallTextPayload | undefined {
    const el = this.element();
    if (el?.type === LANDING_ELEMENT_TYPE.SMALL_TEXT) {
      return el.payload as LandingElementSmallTextPayload;
    }
    return undefined;
  }

  getTextCardPayload(): LandingElementTextCardPayload | undefined {
    const el = this.element();
    if (el?.type === LANDING_ELEMENT_TYPE.TEXT_CARD) {
      return el.payload as LandingElementTextCardPayload;
    }
    return undefined;
  }

  getTextCardStepsPayload(): LandingElementTextCardStepsPayload | undefined {
    const el = this.element();
    if (el?.type === LANDING_ELEMENT_TYPE.TEXT_CARD_STEPS) {
      return el.payload as LandingElementTextCardStepsPayload;
    }
    return undefined;
  }

  getStoresPayload(): LandingElementStorePayload | undefined {
    const el = this.element();
    if (el?.type === LANDING_ELEMENT_TYPE.STORES) {
      return el.payload as LandingElementStorePayload;
    }
    return undefined;
  }
}
