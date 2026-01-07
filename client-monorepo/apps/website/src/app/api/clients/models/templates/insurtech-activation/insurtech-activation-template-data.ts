import { ApiFile } from '../../common/api-file';
import { FaqDefinition } from '../services/faq';
import { UiComplexAccordion } from '../../../../../ui/ui-components/ui-complex-accordion/model/ui-complex-accordion';
import { ButtonCta } from '../../../../../ui/models/button-cta';
import { SimilarService } from '../services/similar-services';

export interface InsurtechActivationTemplateData {
  faq: FaqDefinition;
  sectionRecoverableDamages: RecoverableDamages;
  sectionActivation: InsuranceActivation[];
  sectionRequestInsurance: SimilarService;
  ownershipOther: OwnershipOther;
}

export interface OwnershipOther {
  accordions: UiComplexAccordion;
  modalInfo: {
    title: string;
    description: string;
  };
}

export interface RecoverableDamages {
  title: string;
  items: Array<{
    icon: ApiFile;
    title: string;
  }>;
  publicConditions: {
    firstCta: ButtonCta;
    title: string;
  };
  directCover: {
    accordions: UiComplexAccordion;
    modalInfo: {
      title: string;
      description: string;
    };
  };
}

export interface InsuranceActivation {
  image: ApiFile;
  title: string;
  subtitle: string;
  description: string;
  firstCta: ButtonCta;
}
