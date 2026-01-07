import { CreditIntro, CreditMerchants } from '../credit-v3/credit-config.response';
import { ApiFile } from '../../common/api-file';
import { ButtonCta } from '../../../../../ui/models/button-cta';
import { FaqDefinition } from '../services/faq';
import { BnplHelpSection } from '../c-bnpl/bnpl-help-section';
import { SeoContent } from '../../../../../ui/ui-components/ui-seo/seo-content';
import { TimelineSteps } from '../../../../../ui/models/timeline-steps';

export interface CCreditTemplateData {
  sectionIntro: CreditIntro;
  sectionLoanRoadmap: LoanRoadmap;
  sectionRegistering: Registering;
  sectionStores: CreditMerchants;
  sectionSeoContent: SeoContent;
  sectionFlow: {
    title: string;
    subtitle: string;
    steps: TimelineSteps[];
  };
  faq: FaqDefinition;
}

export interface LoanRoadmap {
  artwork: ApiFile;
  title: string;
  subtitle: string;
  description: string;
  support: {
    description: string;
    firstCta: ButtonCta;
  };
}

export interface Registering {
  onlineRegister: {
    registerType: string;
    registerBenefits: RegisterBenefits;
    infrastructureCosts: {
      title: string;
      description: string;
    };
    totalCosts: {
      title: string;
      description: string;
    };
  };
  inPersonRegister: {
    registerType: string;
    registerBenefits: RegisterBenefits;
    helps: BnplHelpSection[];
  };
}

export interface RegisterBenefits {
  title: string;
  benefits: Array<{
    icon: ApiFile;
    text: string;
    text2?: string;
    shortText?: string;
    iconActive?:ApiFile,
    isActive?: boolean;
  }>;
  subtitle?:string,

}
