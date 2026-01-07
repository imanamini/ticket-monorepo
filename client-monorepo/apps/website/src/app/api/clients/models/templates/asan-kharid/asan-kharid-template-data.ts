import { ApiFile } from '../../common/api-file';
import { FaqDefinition } from '../services/faq';
import { TimelineSteps } from '../../../../../ui/models/timeline-steps';
import { RelatedPosts } from '../blog/related-posts';
import { DigikalaProducts } from '../credit/credit-config.response';
import { FlowDefinition } from '../services/service-page-template';
import { SimilarService } from '../services/similar-services';

export interface AsanKharidTemplateData {
  faq: FaqDefinition;
  relatedPosts: RelatedPosts;
  introTitle: string;
  introSubtitle: string;
  introSubtitle2: string;
  introFirstCta: {
    title: string;
    link: string;
    icon: ApiFile;
  };
  flow: FlowDefinition;
  introArtwork: ApiFile;
  introType: string;
  registrationSteps: {
    title: string;
    steps: TimelineSteps[];
  };
  renewCard: {
    title: string;
    text: string;
    artwork: ApiFile;
  };
  products: {
    title: string;
    subtitle: string;
    productLists: Array<{
      title: string;
      image: ApiFile;
      price: string;
      cashBack: string;
      link: string;
    }>;
  };
  sectionDigikalaProducts: DigikalaProducts;
  similar: SimilarService;
}
