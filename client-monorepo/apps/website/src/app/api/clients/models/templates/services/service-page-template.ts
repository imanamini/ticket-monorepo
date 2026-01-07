import { ApiFile } from '../../common/api-file';
import { FaqDefinition } from './faq';
import { ValueCards } from '../../../../../ui/models/value/value-cards';
import { RelatedPosts } from '../blog/related-posts';
import { SimilarService } from './similar-services';

export interface ServicePageTemplate {
  cta: {
    popup: string;
    title: string;
    link: string;
  };
  services: ValueCards[];
  flow: FlowDefinition;
  similar: SimilarService;
  faq: FaqDefinition;
  relatedPosts: RelatedPosts;
  artworkType: string;
  introTitle: string;
  introSubtitle: string;
  introDescription: string;
  introImages: Array<{
    image: ApiFile;
  }>;
}

export interface FlowDefinition {
  title: string;
  steps: FlowStep[];
  notice?: string;
}

export interface FlowStep {
  title: string;
  description: string;
  images: {
    mainImage: ApiFile;
    focusImage: ApiFile;
  };
}
