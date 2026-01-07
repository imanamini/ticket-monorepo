import { ApiFile } from '../../common/api-file';
import { FaqDefinition } from '../services/faq';
import { RelatedPosts } from '../blog/related-posts';
import { SeoContent } from '../../../../../ui/ui-components/ui-seo/seo-content';

export interface IpgTemplateData {
  faq: FaqDefinition;
  relatedPosts: RelatedPosts;
  introTitle: string;
  introSubtitle1: string;
  introSubtitle2: string;
  introFirstCta: {
    title: string;
    link: string;
  };
  introArt: ApiFile;
  introType: string;
  features: Array<{
    featureIcon: ApiFile;
    featureTitle: string;
    featureText: string;
  }>;
  gatewayExplanation: {
    title: string;
    description: string;
    notice: string;
    artwork: ApiFile;
  };
  algorithmExplanation: {
    title: string;
    description: string;
    notice: string;
  };
  algorithmFeatures: Array<{
    featureIcon: ApiFile;
    featureTitle: string;
  }>;
  paymentServiceProviders: {
    mainTitle: string;
    pspItems: Array<{
      pspLogo: ApiFile;
      hoverText: string;
    }>;
  };
  universalPaymentGateway: {
    upgTitle: string;
    upgDesc: string;
    upgNotice: string;
    refundTitle: string;
    refundDesc: string;
    upgImage: ApiFile;
    pspItems: Array<{
      pspLogo: ApiFile;
      hoverText: string;
    }>;
  };
  ourCustomersTitle: string;
  customerItems: Array<{
    customerLogo: ApiFile;
    customerTitle: string;
    customerSubtitle: string;
  }>;
  sectionSeoContent: SeoContent;
}
