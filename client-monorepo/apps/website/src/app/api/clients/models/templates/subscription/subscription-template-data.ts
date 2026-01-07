import { ApiFile } from '../../common/api-file';
import { FaqDefinition } from '../services/faq';
import { TimelineSteps } from '../../../../../ui/models/timeline-steps';
import { RelatedPosts } from '../blog/related-posts';
import { SeoContent } from '../../../../../ui/ui-components/ui-seo/seo-content';

export interface SubscriptionTemplateData {
  faq: FaqDefinition;
  relatedPosts: RelatedPosts;
  introTitle: string;
  introSubtitle: string;
  introSubtitle2: string;
  introFirstCta: {
    title: string;
    link: string;
  };
  introArtwork: ApiFile;
  introType: string;
  features: Array<{
    featureIcon: ApiFile;
    featureTitle: string;
    featureText: string;
  }>;
  productExplanation: TimelineSteps;
  customerRetention: TimelineSteps;
  whyTheBest: TimelineSteps;
  directWithdrawal: TimelineSteps;
  supportedBanks: {
    title: string;
    logos: Array<{
      bankLogo: ApiFile;
      bankName: string;
    }>;
  };
  tariffs: {
    title: string;
    subtitle: string;
    keyValuePairs: Array<{
      key: string;
      value: string;
    }>;
    description: string;
    notice: string;
  };
  sectionSeoContent: SeoContent;
}
