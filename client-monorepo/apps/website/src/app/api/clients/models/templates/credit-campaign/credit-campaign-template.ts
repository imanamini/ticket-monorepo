import { ApiFile } from '../../common/api-file';
import { ButtonCta } from '../../../../../ui/models/button-cta';
import { FeatureCards } from '../ipg/feature-cards';
import { FaqDefinition } from '../services/faq';

export interface CreditCampaignTemplate {
  modalBanner: ModalBanner;
  sectionCounter: {
    title: string;
    subtitle: string;
    counter: {
      show: string;
      title: string;
      deadline: number;
    };
    image: ApiFile;
    firstCta: {
      id: string;
      title: string;
      link: string;
      color: string;
      backgroundColor: string;
    };
    description?:string
  };
  sectionValue: {
    values: FeatureCards[];
    firstCta: ButtonCta;
  };
  mainForm: {
    title: string;
    subtitle: string;
    modal: FormModal;
  };
  faq: FaqDefinition;
}

export interface ModalBanner {
  image: ApiFile;
  title: string;
  subtitle: string;
  description: string;
  texts: Array<{
    text: string;
  }>;
  firstCta: ButtonCta;
}

export interface PromotionServicesModal {
  title: string;
  services: Array<{
    imagePath: ApiFile;
    title: string;
    subtitle: string;
    color: string;
    url: string;
  }>;
}

export interface FormModal {
  promotionServices: PromotionServicesModal;
  modalBannerDesktop: ApiFile;
  modalBannerMobile: ApiFile;
  bannerLink: string;
}
