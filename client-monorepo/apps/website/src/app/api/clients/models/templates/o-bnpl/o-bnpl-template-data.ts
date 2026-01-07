import { ApiFile } from '../../common/api-file';
import { FaqDefinition } from '../services/faq';
import { RelatedPosts } from '../blog/related-posts';
import { SectionValue } from '../../../../../ui/models/value/section-value';

export interface OBnplTemplateData {
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
  sectionValue: SectionValue;
  sectionCustomers: {
    title: string;
    invite: string;
    customers: BnplCustomers[];
  };
  sectionRequest: {
    title: string;
    image: ApiFile;
    description: string;
  };
}

export interface BnplCustomers {
  title: string;
  icon: ApiFile;
}
