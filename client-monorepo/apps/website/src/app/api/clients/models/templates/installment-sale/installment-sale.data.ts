import { ApiFile } from '../../common/api-file';
import { FaqDefinition } from '../services/faq';
import { ButtonCta } from '../../../../../ui/models/button-cta';
import { TimelineSteps } from '../../../../../ui/models/timeline-steps';

export interface InstallmentSaleData {
  sectionIntro: {
    images: Array<{
      image: ApiFile;
    }>;
    values: Array<{
      value: string;
    }>;
    firstCta: ButtonCta;
  };
  sectionVideo: {
    type: string;
    artwork: ApiFile;
    videoCover: ApiFile;
    title: string;
    subtitle: string;
    subtitle2: string;
    firstCta: ButtonCta;
    secondCta: ButtonCta;
  };
  getCreditExplanation: ExplanationTemplate;
  noGuarantorExplanation: ExplanationTemplate;
  prepaymentExplanation: ExplanationTemplate;
  paymentExplanation: ExplanationTemplate;
  sectionFlow: {
    title: string;
    subtitle: string;
    steps: TimelineSteps[];
  };
  faq: FaqDefinition;
}

export interface ExplanationTemplate {
  title: string;
  description: string;
  firstCta: {
    title: string;
    link: string;
  };
  artwork: ApiFile;
}
