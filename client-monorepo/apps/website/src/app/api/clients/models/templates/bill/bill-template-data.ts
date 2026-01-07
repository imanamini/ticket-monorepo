import { ApiFile } from '../../common/api-file';
import { FaqDefinition } from '../services/faq';
import { RelatedPosts } from '../blog/related-posts';
import { SimilarService } from '../services/similar-services';
import { SeoContent } from '../../../../../ui/ui-components/ui-seo/seo-content';

export interface BillTemplateData {
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
  sectionBills: {
    title: string;
    subtitle: string;
    bills: Bills[];
  };
  sectionBenefits: {
    title: string;
    subtitle: string;
    benefits: BillBenefits[];
  };
  similar: SimilarService;
  sectionSeoContent: SeoContent;
}

export interface Bills {
  icon: ApiFile;
  title: string;
}

export interface BillBenefits {
  title: string;
  subtitle: string;
  text: string;
  cta: {
    title: string;
    link: string;
  };
  image: ApiFile;
  type: string;
}
