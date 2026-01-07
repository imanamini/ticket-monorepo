import { FaqDefinition } from '../services/faq';
import { ApiFile } from '../../common/api-file';
import { SectionExplanation } from '../explanation/section-explanation';
import { SimilarService } from '../services/similar-services';
import { SeoContent } from '../../../../../ui/ui-components/ui-seo/seo-content';

export interface InternetTemplateData {
  faq: FaqDefinition;
  sectionIntro: InternetProductData;
  internetExplanation: SectionExplanation;
  similar: SimilarService;
  sectionSeoContent: SeoContent;
}

export interface InternetProductData {
  title: string;
  subtitle: string;
  box: InternetBoxData;

  providers: Array<{
    title: string;
    image: ApiFile;
    imageHover: ApiFile;
    hover: boolean;
  }>;
}

export interface InternetBoxData {
  title: string;
  promotion: Array<{
    icon: ApiFile;
    text: string;
  }>;
}
