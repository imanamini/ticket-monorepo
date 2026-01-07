import { SeoContent } from '../../../../../ui/ui-components/ui-seo/seo-content';
import { FaqDefinition } from '../services/faq';
import { CreditIntro } from '../credit-v3/credit-config.response';
import { ApiFile } from '../../common/api-file';
import { ButtonCta } from '../../../../../ui/models/button-cta';

export interface WealthTemplateData {
  sectionIntro: CreditIntro;
  investmentSteps: InvestmentSteps;
  boursePromotion: WealthBoursePromotion;
  compareMarkets: MostProfitableInvestmentMarket;
  compareMarketsProperties: WealthComparisonTable;
  sectionSeoContent: SeoContent;
  faq: FaqDefinition;
}

export interface InvestmentSteps {
  title: string;
  steps: Array<{
    stepTitle: string;
    stepDescription: string;
  }>;
}

export interface WealthBoursePromotion {
  title: string;
  subtitle: string;
  effectiveParameters: {
    description: string;
    items: Array<{
      icon: ApiFile;
      title: string;
    }>;
  };
  stockFund: {
    description: string;
    items: Array<{
      icon: ApiFile;
      title: string;
    }>;
    firstCta: ButtonCta;
  };
  fixedIncomeFund: {
    description: string;
    items: Array<{
      icon: ApiFile;
      title: string;
    }>;
    firstCta: ButtonCta;
  };
}

export interface MostProfitableInvestmentMarket {
  title: string;
  description: string;
  marketBenefits: Array<MarketBenefits>;
}

export interface WealthComparisonTable {
  title: string;
  description: string;
  subtitle: string;
}

export interface MarketBenefits {
  market: string;
  icon: ApiFile;
  marketData: Array<{
    year: number;
    benefit: number;
  }>;
}
