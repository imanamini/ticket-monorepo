import { ApiFile } from '../../common/api-file';

export interface BetaAppTemplate {
  introSubtitle: string;
  introDescription: string;
  introCtaText: string;
  introArtwork: ApiFile;
  features: Array<{
    title: string;
    items: Array<{
      featureIcon: ApiFile;
      featureTitle: string;
      featureDesc: string;
    }>;
  }>;
  modal: {
    artwork: ApiFile;
    title: string;
    desc: string;
    downloadUrl: string;
    downloadBtnText: string;
  };
}
