import { FaqDefinition } from '../services/faq';
import { ApiFile } from '../../common/api-file';
import { SectionBenefits } from '../../../../../ui/models/ui-section-benefits';
import { SimilarService } from '../services/similar-services';
import { SectionExplanation } from '../explanation/section-explanation';
import { SeoContent } from '../../../../../ui/ui-components/ui-seo/seo-content';

export interface CarFineTemplateData {
  sectionFineInquiryAndPayment: SectionFineInquiryAndPayment;
  sectionBenefits: SectionBenefits;
  sectionPaymentWays: PaymentWays;
  sectionPaymentSteps: SectionExplanation;
  sectionSimilarServices: SimilarService;
  sectionSeoContent: SeoContent;
  faq: FaqDefinition;
}

export interface SectionFineInquiryAndPayment {
  detailedFineLink: string;
  promotions: Array<ServicePromotion>;
}

export interface ServicePromotion {
  text: string;
  icon: ApiFile;
}

export interface PaymentWays {
  title: string;
  items: Array<{
    icon: ApiFile;
    title: string;
    description: string;
    costTitle: string;
    costAmount: string;
  }>;
}
