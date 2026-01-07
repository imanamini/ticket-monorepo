import { ApiFile } from '../../common/api-file';
import { FaqDefinition } from '../services/faq';
import { RelatedPosts } from '../blog/related-posts';
import { TimelineSteps } from '../../../../../ui/models/timeline-steps';
import { SeoContent } from '../../../../../ui/ui-components/ui-seo/seo-content';

export interface PardakhtyarTemplateData {
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
  serviceExplanation: {
    title: string;
    text: string;
    artwork: ApiFile;
  };
  userInterfaceExplanation: {
    title: string;
    text: string;
    artwork: ApiFile;
  };
  walletExplanation: {
    title: string;
    text: string;
    artwork: ApiFile;
  };
  registrationSteps: {
    title: string;
    steps: TimelineSteps[];
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
