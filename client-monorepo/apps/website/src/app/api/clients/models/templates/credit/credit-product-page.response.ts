import { BaseResponse } from '../../base.response';
import { Page } from '../../content/page';
import { FaqDefinition } from '../services/faq';
import { ApiFile } from '../../common/api-file';

export interface CreditProductPageResponse extends BaseResponse {
  page: Page<any>;
}

export interface CreditProductPageTemplate {
  faq: FaqDefinition;
  sectionIntro: {
    titles: {
      title: string;
      subtitle: string;
      description: string;
    };
    cta: {
      title: string;
      details: {
        popup: string;
        title: string;
        link: string;
      };
    };
    products: Array<{
      image: ApiFile;
    }>;
  };
  sectionRegister: {
    title: string;
    description: string;
    cta: {
      title: string;
      link: string;
    };
  };
  sectionFlow: {
    title: string;
    steps: Array<{
      icon: ApiFile;
      title: string;
      description: string;
    }>;
  };
  sectionBrands: {
    title: string;
    brands: Array<{
      title: string;
      image: ApiFile;
    }>;
  };
  sectionProducts: {
    title: string;
    contents: Array<{
      title: string;
      icon: ApiFile;
      text: string;
    }>;
  };
}
