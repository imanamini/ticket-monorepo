import { SimilarService } from '../services/similar-services';
import { FeatureCards } from '../ipg/feature-cards';
import { FaqDefinition } from '../services/faq';
import { ApiFile } from '../../common/api-file';
import { TimelineSteps } from '../../../../../ui/models/timeline-steps';
import { ButtonCta } from '../../../../../ui/models/button-cta';
import { UiComplexAccordion } from '../../../../../ui/ui-components/ui-complex-accordion/model/ui-complex-accordion';
import { SeoContent } from '../../../../../ui/ui-components/ui-seo/seo-content';

export interface CardToCardTemplateData {
  sectionBanks: CTCSectionBanks;
  sectionValue: {
    title: string;
    values: FeatureCards[];
  };
  sectionBankTransaction: CTCSectionBankTransaction;
  sectionSteps: {
    title: string;
    statisticsSide: CTCStatistics;
    steps: TimelineSteps[];
    firstCta: ButtonCta;
  };
  sectionShaparakActivate: {
    title: string;
    complexAccordions: UiComplexAccordion[];
  };
  similar: SimilarService;
  sectionSeoContent: SeoContent;
  faq: FaqDefinition;
}

export interface CTCStatistics {
  image: ApiFile;
  statistics: Array<{
    title: string;
    value: string;
    unit: string;
  }>;
}

export interface CTCSectionBankTransaction {
  title: string;
  transactionLimit: {
    title: string;
    banks: Array<{
      logo: ApiFile;
      name: string;
      amount: string;
    }>;
    notice: string;
  };
  fee: {
    title: string;
    amounts: Array<{
      period: string;
      amount: string;
    }>;
    notice: string;
  };
}

export interface CTCSectionBanks {
  title: string;
  subtitle: string;
  banks: Array<{
    logo: ApiFile;
    logoGray: ApiFile;
    nameFa: string;
    nameEn: string;
  }>;
  firstCta: ButtonCta;
  secondCta: ButtonCta;
}
