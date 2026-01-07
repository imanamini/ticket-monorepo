import { CreditIntro, Merchant } from '../credit-v3/credit-config.response';
import { SeoContent } from '../../../../../ui/ui-components/ui-seo/seo-content';
import { FaqDefinition } from '../services/faq';
import { GainCreditOffer } from '../merchants-digikala/merchants-digikala-template-data';

export interface MerchantsTemplateData {
  sectionIntro: CreditIntro;
  sectionMerchants: Merchants;
  sectionSeoContent: SeoContent;
  faq: FaqDefinition;
}

export interface Merchants {
  title: string;
  stores: Merchant[];
  gainCreditOffer: GainCreditOffer;
}
