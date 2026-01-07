import { TimelineSteps } from './timeline-steps';

export interface ContentNavData {
  title: string;
  subtitle: string;
  services: Array<{
    shortDetails: TimelineSteps;
    fullDetails: TimelineSteps;
    features: Array<{
      title: string;
    }>;
    moreInfo: {
      title: string;
      link: string;
    };
  }>;
}
