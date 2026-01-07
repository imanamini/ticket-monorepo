import { ApiFile } from '../../common/api-file';
import { SectionValue } from '../../../../../ui/models/value/section-value';
import { TimelineSteps } from '../../../../../ui/models/timeline-steps';
import { FaqDefinition } from '../services/faq';
import { RelatedPosts } from '../blog/related-posts';
import { SeoContent } from '../../../../../ui/ui-components/ui-seo/seo-content';

export interface BpgTemplateData {
  faq: FaqDefinition;
  relatedPosts: RelatedPosts;
  sectionIntro: {
    type: string;
    title: string;
    subtitle: string;
    artwork: ApiFile;
    firstCta: {
      title: string;
      link: string;
    };
    secondCta: {
      title: string;
      link: string;
    };
  };
  sectionValue: SectionValue;
  feeExplanation: {
    title: string;
    description: string;
    firstCta: {
      title: string;
      link: string;
    };
    artwork: ApiFile;
  };
  sectionFlow: {
    title: string;
    subtitle: string;
    steps: TimelineSteps[];
  };
  sectionPartners: {
    title: string;
    subtitle: string;
    partners: BPGPartners[];
  };
  sectionRequest: {
    title: string;
    subtitle: string;
    image: ApiFile;
    description: string;
  };
  sectionSeoContent: SeoContent;
}

export interface BPGPartners {
  name: string;
  logo: ApiFile;
  firstCta: {
    title: string;
    link: string;
  };
}
