import { BaseResponse } from '../../base.response';
import { ApiFile } from '../../common/api-file';
import { Page } from '../../content/page';
import { FaqDefinition } from '../services/faq';
import { TimelineSteps } from '../../../../../ui/models/timeline-steps';
import { RelatedPosts } from '../blog/related-posts';
import { BlogPost } from '../../content/blog-post';
import { SimilarService } from '../services/similar-services';
import { ButtonCta } from '../../../../../ui/models/button-cta';
import { FeatureCards } from '../ipg/feature-cards';

export interface CreditConfigResponse extends BaseResponse {
  basePage: Page<CreditPageTemplateData>;
  config: CreditFundItem[];
  posts: BlogPost[];
  information: CreditConfigInfo;
  value: FeatureCards[];
  flow: CreditFlow;
  shortFlow: CreditShortFlow;
  calculatorTitles: CalculatorTitles;
}

export interface CreditPageTemplateData {
  faq: FaqDefinition;
  relatedPosts: RelatedPosts;
  introType: string;
  sectionIntro: {
    title: string;
    subtitle: string;
    artwork: ApiFile;
    firstCta: ButtonCta;
    secondCta: ButtonCta;
  };
  sectionProvider: CreditFundItem[];
  sectionCredit: CreditConfigInfo;
  sectionDigikalaProducts: DigikalaProducts;
  creditGuide: SimilarService;
  similar: SimilarService;
  sectionDigikala: {
    title: string;
    description: string;
    image: ApiFile;
  };
  sectionBuyDigikala: {
    title: string;
    subtitle: string;
    items: Array<{
      image: ApiFile;
      title: string;
      link: string;
    }>;
  };
  sectionRegister: {
    title: string;
    description: string;
    cta: ButtonCta;
  };
  modalDigitalSignature: {
    title: string;
    description: string;
    firstCta: ButtonCta;
    secondCta: ButtonCta;
  };
}

export interface CreditFundItem {
  creditsSupplier: {
    creditsSupplierLogo: ApiFile;
    creditsSupplierName: string;
    creditsSupplierDiscount: string;
    creditsSupplierActive: string;
    creditsSupplierGuarantee: any;
    creditDescriptionCollapse: CreditDescriptionCollapse[];
  };
  creditsDetails: FundItemDetails[];
  notices: Array<{
    text: string;
  }>;
}

export interface FundItemDetails {
  creditsDetailsCredit: string;
  creditsDetailsTypes: Array<FundItemPaymentDetails>;
}

export interface FundItemPaymentDetails {
  creditsDetailsTypesPeriod: string;
  creditsDetailsTypesInfo: {
    creditsDetailsTypesInfoPrepay: string;
    creditsDetailsTypesInfoFinalrefund: string;
    creditsDetailsTypesInfoCheque: string;
    creditsDetailsTypesInfoPeriodamount: string;
  };
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

export interface CreditFlow {
  title: string;
  subtitle: string;
  steps: TimelineSteps[];
  firstCta: ButtonCta;
}

export interface CreditShortFlow {
  title: string;
  subtitle: string;
  steps: Array<{
    icon: ApiFile;
    title: string;
    subtitle: string;
  }>;
}

export interface CreditDescriptionCollapse {
  title: string;
  tabs: Array<{
    title: string;
    texts: Array<{
      text: string;
    }>;
  }>;
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

export interface CalculatorTitles {
  title: string;
  subtitle: string;
  supplierPerAmount: {
    title: string;
    help: string;
  };
  supplierDiscount: {
    title: string;
    help: string;
  };
  supplierPrepay: {
    title: string;
    help: string;
  };
  supplierGuarantee: {
    title: string;
    help: string;
    firstCta: ButtonCta;
  };
  supplierCheque: {
    title: string;
    help: string;
  };
  supplierFinalRefund: {
    title: string;
    help: string;
  };
  firstCta: ButtonCta;
  secondCta: ButtonCta;
}
