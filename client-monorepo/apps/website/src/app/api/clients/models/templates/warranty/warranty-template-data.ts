import { ApiFile } from '../../common/api-file';

export interface WarrantyTemplateData {
  introTitle: string;
  introSubtitle: string;
  introDescription: string;
  tabs: Array<{
    tabTitle: string;
    tabType: string;
    id: string;
    title: string;
    flows: Array<{
      title: string;
      description: string;
      image: ApiFile;
      firstCta: {
        title: string;
        link: string;
      };
      notices: Array<{
        text: string;
      }>;
    }>;
  }>;
  promotion: PromotionBanner;
}

export interface PromotionBanner {
  desktopBanner: ApiFile;
  tabletBanner: ApiFile;
  mobileBanner: ApiFile;
  link: string;
  firstCta: {
    title: string;
    link: string;
  };
}
