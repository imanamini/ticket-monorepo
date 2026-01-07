import { ApiFile } from '../../common/api-file';
import { FaqDefinition } from '../services/faq';
import { TimelineSteps } from '../../../../../ui/models/timeline-steps';
import { ValueCards } from '../../../../../ui/models/value/value-cards';
import { RelatedPosts } from '../blog/related-posts';
import { UiComplexAccordion } from '../../../../../ui/ui-components/ui-complex-accordion/model/ui-complex-accordion';
import { ButtonCta } from '../../../../../ui/models/button-cta';
import { FeatureCards } from '../ipg/feature-cards';
import { SimilarService } from '../services/similar-services';
import { SectionBenefits } from '../../../../../ui/models/ui-section-benefits';
import { SeoContent } from '../../../../../ui/ui-components/ui-seo/seo-content';

export interface InsurtechTemplateData {
  faq: FaqDefinition;
  relatedPosts: RelatedPosts;
  sectionIntro: {
    image: ApiFile;
    titles: {
      firstTitle: string;
      secondTitle: string;
      thirdTitle: string;
    };
    covers: Array<{
      title: string;
      description: string;
      image: ApiFile;
    }>;
    login: {
      text: string;
      link: string;
    };
    inquiry: {
      text: string;
      link: string;
    };
  };
  sectionRecoverableDamages: RecoverableDamages;
  sectionInsuranceBenefits: SectionBenefits;
  sectionInsuranceServicesProcesses: InsuranceServicesProcesses;
  sectionInsuranceInquiry: InsuranceInquiry;
  sectionPastInsurance: SimilarService;
  sectionValue: {
    values: ValueCards[];
  };
  steps: Array<{
    name: string;
    title: string;
    id: string;
    tabs: InsurtechTabs[];
  }>;
  sectionSeoContent: SeoContent;
}

export interface Notice {
  text: string;
  cta: {
    text: string;
    link: string;
  };
}

export interface InsurtechTabs {
  title: string;
  id: string;
  items: TimelineSteps[];
  notice: Notice;
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

export class TempFeatureCardProxy {
  newFeatureCard: FeatureCards;

  constructor(oldFeatureCard: any) {
    this.newFeatureCard = {
      featureIcon: oldFeatureCard.icon,
      featureTitle: oldFeatureCard.title,
      featureText: oldFeatureCard.subtitle,
    };
  }
}

export interface InsuranceServicesProcesses {
  title: string;
  tabs: Array<{
    tabTitle: string;
    icon: ApiFile;
    tabPanel: {
      switchPages: Array<{
        switchPageTitle: string;
        switchPageContent: {
          items: Array<{
            title: string;
            icon: ApiFile;
            description: string;
          }>;
          opinionIcon: ApiFile;
          opinion: string;
          opinionSolution: {
            title: string;
            firstCta: ButtonCta;
          };
        };
      }>;
    };
  }>;
}

export interface InsuranceInquiry {
  image: ApiFile;
  title: string;
  subtitle: string;
  description: string;
  inquiryBox: {
    icon: ApiFile;
    title: string;
    inputs: {
      phoneNumberDefault: string;
      serialNumberDefault: string;
    };
    firstCta: ButtonCta;
    hint: {
      title: string;
      icon: ApiFile;
    };
  };
}
