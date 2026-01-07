import { ApiFile } from '../../common/api-file';
import { ButtonCta } from '../../../../../ui/models/button-cta';
import { FaqDefinition } from '../services/faq';
import { SeoContent } from '../../../../../ui/ui-components/ui-seo/seo-content';

export interface MerchantCreditTemplateData {
  sectionIntro: MerchantCreditIntro;
  sectionEarlyCheckout: EarlyCheckoutActivation;
  sectionBenefits: Benefits;
  sectionCalculator: Calculator;
  sectionSeoContent: SeoContent;
  faq: FaqDefinition;
}

export interface MerchantCreditIntro {
  title: string;
  subtitle: string;
  desktopBanner: ApiFile;
  tabletBanner: ApiFile;
  mobileBanner: ApiFile;
  firstCta: ButtonCta;
}

export interface EarlyCheckoutActivation {
  artwork: ApiFile;
  title: string;
  subtitle: string;
  description: string;
  support: {
    description: string;
    supportTelTitle: string;
    supportTel: string;
  };
}

export interface Calculator {
  title: string;
  subtitle: string;
  recipeTitle: string;
  checkoutTimeTitle: string;
  earlyTimeTitle: string;
  payableTitle: string;
  decreaseTitle: string;
  totalWageTitle: string;
  totalProfitTitle: string;
  providersTitle: string;
  firstCta: ButtonCta;
  defaultAmount: string;
  providers: Array<{
    activeIcon: ApiFile;
    disableIcon: ApiFile;
    profitType: string;
    profit: string;
    wage: string;
    minimumWage: string;
    name: string;
    subtitle: string;
  }>;
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
