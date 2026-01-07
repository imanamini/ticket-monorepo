import { FaqDefinition } from '../services/faq';
import { ApiFile } from '../../common/api-file';
import { SimilarService } from '../services/similar-services';
import { SectionExplanation } from '../explanation/section-explanation';
import { SeoContent } from '../../../../../ui/ui-components/ui-seo/seo-content';

export interface TopUpTemplateData {
  faq: FaqDefinition;
  sectionIntro: {
    title: string;
    subtitle: string;
    box: {
      title: string;
      promotion: Array<{
        icon: ApiFile;
        text: string;
      }>;
    };
    providers: Array<{
      title: string;
      image: ApiFile;
    }>;
  };
  chargeExplanation: SectionExplanation;
  similar: SimilarService;
  sectionSeoContent: SeoContent;
}
