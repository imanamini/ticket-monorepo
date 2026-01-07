import { ApiFile } from '../../common/api-file';
import { FaqDefinition } from '../services/faq';
import { TimelineSteps } from '../../../../../ui/models/timeline-steps';
import { RelatedPosts } from '../blog/related-posts';

export interface BnplTemplateData {
  faq: FaqDefinition;
  relatedPosts: RelatedPosts;
  introTitle: string;
  introSubtitle: string;
  introSubtitle2: string;
  introCtaText: string;
  introArtwork: ApiFile;
  introType: string;
  features: Array<{
    featureIcon: ApiFile;
    featureTitle: string;
    featureText: string;
  }>;
  purchaseSteps: {
    title: string;
    steps: TimelineSteps[];
  };
  mainForm: {
    title: string;
    description: string;
    notice: string;
  };
}
