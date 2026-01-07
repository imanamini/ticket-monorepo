import {ApiFile} from '../../common/api-file';

export interface AboutUsTemplateData {
  introSection: {
    description: string,
    imageDesktop: ApiFile,
    imageMobile: ApiFile,
    subtitle: string,
    title: string
  }
  mainHistory: {
    blueTitle: string;
    blackTitle: string;
    description: string;
    history: Array<{
      image: ApiFile;
      title: string;
      subtitle: string;
      description: string;
    }>;
  };
  mainTrait: Array<{
    image: ApiFile;
    title: string;
    description: string;
  }>;
  mainVision: {
    title: string;
    subtitle: string;
    image: ApiFile;
    visions: Array<{
      title: string;
      description: string;
      image: ApiFile
    }>;
  };
  honors: honors,
  appServices: {
    title: string,
    subtitle: string,
    services: Array<{
      link: ApiFile,
      title: string,
      icon: ApiFile,
    }>
  };
  mainMembership: {
    title: string;
    membership: Array<{
      image: ApiFile;
      title: string;
      description: string;
    }>;
    ctaText: string;
    ctaBtnText: string;
    ctaLink: string;
  };
}


export interface honors {
  title: string;
  subtitle: string;
  items: Array<{
    image: ApiFile,
    title: string,
    year: string,
  }>,
  gallery: Array<customGallery>
}

export interface customGallery {
  image: ApiFile;
  title: string;
  description: string;
  cta: {
    title: string;
    link: string;
  }
}
