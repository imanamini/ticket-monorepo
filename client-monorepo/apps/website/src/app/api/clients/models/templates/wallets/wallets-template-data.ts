import { ApiFile } from '../../common/api-file';
import { FaqDefinition } from '../services/faq';
import { RelatedPosts } from '../blog/related-posts';
import { FeatureCards } from '../ipg/feature-cards';
import { SectionExplanation } from '../explanation/section-explanation';

export interface WalletsTemplateData {
  faq: FaqDefinition;
  relatedPosts: RelatedPosts;
  sectionWalletProduct: WalletsSectionWalletProduct;
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
  sectionValue: FeatureCards[];
  activationExplanation: SectionExplanation;
  securityExplanation: SectionExplanation;
  bankCardExplanation: SectionExplanation;
  transferExplanation: SectionExplanation;
  optionExplanation: SectionExplanation;
  businessExplanation: SectionExplanation;
  mainForm: {
    title: string;
    description: string;
    notice: string;
  };
}

export interface WalletsSectionWalletProduct {
  title: string;
  subtitle: string;
  box: {
    title: string;
    beforeLoginImage: ApiFile;
    beforeLoginText: string;
    promotion: Array<{
      icon: ApiFile;
      text: string;
    }>;
  };
}
