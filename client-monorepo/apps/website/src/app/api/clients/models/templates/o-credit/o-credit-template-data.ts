import { ApiFile } from '../../common/api-file';
import { TimelineSteps } from '../../../../../ui/models/timeline-steps';
import { ContentNavData } from '../../../../../ui/models/content-nav-data';

export interface OCreditTemplateData {
  introTitle: string;
  introSubtitle: string;
  introFirstCta: {
    title: string;
    link: string;
  };
  introArtwork: ApiFile;
  introType: string;
  sectionQualified: ContentNavData;
  sectionSteps: OCreditSteps;
  sectionRequest: {
    title: string;
    subtitle: string;
    image: ApiFile;
    description: string;
  };
}

export interface OCreditSteps {
  title: string;
  subtitle: string;
  items: Array<{
    title: string;
    steps: TimelineSteps[];
  }>;
}
