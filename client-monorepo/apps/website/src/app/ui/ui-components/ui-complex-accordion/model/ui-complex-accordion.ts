import { LandingElement } from '../../../../api/clients/models/templates/c-bnpl/landing-element';
import { ApiFile } from '../../../../api/clients/models/common/api-file';
import { ButtonCta } from '../../../models/button-cta';

export interface UiComplexAccordion {
  icon: ApiFile;
  title: string;
  subtitle?: string;
  ctaIcon?: ApiFile;
  firstCta?: ButtonCta;
  secondCta?: ButtonCta;
  items: LandingElement[];
  modals?: Array<UiComplexAccordionModal>;
}

export interface UiComplexAccordionModal {
  id: string;
  title: string;
  content: string;
  noticeTitle: string;
  notices: Array<{
    text: string;
  }>;
  firstCta: ButtonCta;
}
