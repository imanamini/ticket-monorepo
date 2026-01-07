import { ApiFile } from '../../common/api-file';
import { FaqDefinition } from '../services/faq';
import { ButtonCta } from '../../../../../ui/models/button-cta';
import { FeatureCards } from '../ipg/feature-cards';
import { SeoContent } from '../../../../../ui/ui-components/ui-seo/seo-content';

export interface CreditPageTemplateData {
  faq: FaqDefinition;
  sectionIntro: CreditIntro;
  sectionInsurancePlansTypes: InsurancePlansTypes;
  sectionCredit: CreditConfigInfo;
  sectionSeoContent: SeoContent;
  sectionStores: CreditMerchants;
}

export interface CreditIntro {
  title: string;
  subtitle: string;
  desktopBanner: ApiFile;
  tabletBanner: ApiFile;
  mobileBanner: ApiFile;
  firstCta: ButtonCta;
  secondCta: ButtonCta;
  tips: any;
}

export interface SectionCreditCategories {
  title: string;
  creditCategories: Array<{
    icon: ApiFile;
    title: string;
  }>;
}

export interface CreditKeyValues {
  title: string;
  values: FeatureCards[];
}

export interface InsurancePlansTypes {
  title: string;
  insurancePlans: Array<{
    title: string;
    titleIcon: ApiFile;
    type: string;
    content: {
      description: string;
      hints: {
        title: string;
        items: Array<{
          text: string;
          modalData: {
            title: string;
            stepsTitle: string;
            steps: Array<{
              text: string;
            }>;
          };
        }>;
        hintsText: string;
      };
      cards: Array<{
        isActive: string;
        artwork: ApiFile;
        title: string;
        subtitle: string;
        description: {
          text: string;
          hints: Array<{
            text: string;
          }>;
        };
        facilitiesAmount: {
          title: string;
          facilities: Array<{
            dataTitle: string;
            dataText: string;
          }>;
        };
        approvedGuarantees: {
          title: string;
          guarantees: Array<{
            icon: ApiFile;
            text: string;
          }>;
        };
        firstCta: ButtonCta;
        secondCta: ButtonCta;
      }>;
      features: Array<{
        title: string;
        artwork: ApiFile;
        description: string;
        contentType: string;
        featuresTypes: {
          title: string;
          items: Array<{
            icon: ApiFile;
            title: string;
            description: string;
          }>;
        };
        firstCta: ButtonCta;
        secondCta: ButtonCta;
      }>;
    };
  }>;
}

export interface OtherServices {
  title: string;
  subtitle: string;
  services: Array<{
    serviceLink: string;
    icon: ApiFile;
    title: string;
    titleColor: string;
    subtitle: string;
  }>;
}

export interface CreditConfigInfo {
  titles: {
    title: string;
    subtitle: string;
    supplierTag: string;
    amountTag: string;
    periodTag: string;
  };
  description: string;
  calculateTitles: {
    icons: {
      amountPer: ApiFile;
      prePayment: ApiFile;
      finalRefund: ApiFile;
      guaranteeCheque: ApiFile;
    };
    titles: {
      amountPer: string;
      prePayment: string;
      finalRefund: string;
      guaranteeCheque: string;
    };
  };
}

export interface DigikalaProducts {
  title: string;
  subtitle: string;
  tabs: Array<{
    id: string;
    title: string;
    description: string;
    icon: ApiFile;
    ctaType: string;
    productCreditPeriod: {
      title: string;
      period: string;
    };
    productCta: ButtonCta;
    firstCta: ButtonCta;
  }>;
}

export interface CreditMerchants {
  title: string;
  stores: Merchant[];
}

export interface Merchant {
  storeIcon: ApiFile;
  storeName: string;
  storeDescription: string;
  services: Array<{
    serviceIcon: ApiFile;
    iconBackgroundColor: string;
  }>;
  providers: {
    title: string;
    items: Array<{
      icon: ApiFile;
      name: string;
      pageLink: string;
    }>;
  };
  firstCta: ButtonCta;
}
