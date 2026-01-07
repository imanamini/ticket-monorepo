import { FaqDefinition } from '../services/faq';
import { ApiFile } from '../../common/api-file';

export interface WorkingCapitalTemplateData {
  faq: FaqDefinition;
  sectionBenefits: Benefits;
  onboarding: {
    items: Array<{
      benefitDescription: string;
      benefitIcon: ApiFile;
      benefitTitle: string;
    }>;
  };
  mainForm: {
    title: string;
    description: string;
    notice: string;
  };
}

export interface Benefits {
  benefitsTitle: string;
  benefitsSubtitle: string;
  items: Array<{
    benefitDescription: string;
    benefitIcon: ApiFile;
    benefitTitle: string;
  }>;
}
