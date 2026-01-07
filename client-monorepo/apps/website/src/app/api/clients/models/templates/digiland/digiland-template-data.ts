import { ApiFile } from '../../common/api-file';

export interface DigilandTemplateData {
  sectionIntro: {
    title: string;
    subtitle: string;
    btnTitle: string;
    btnLink: string;
    prizes: Array<{
      title: string;
      image: ApiFile;
    }>;
  };
  sectionVideo: {
    title: string;
    video: ApiFile;
  };
  sectionRules: {
    title: string;
    rules: Array<{
      text: string;
    }>;
  };
  copyright: string;
}
