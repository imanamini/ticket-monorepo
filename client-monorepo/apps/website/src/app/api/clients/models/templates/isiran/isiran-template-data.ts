import { TimelineSteps } from '../../../../../ui/models/timeline-steps';
import { FaqDefinition } from '../services/faq';
import { SectionExplanation } from '../explanation/section-explanation';
import { FeatureCards } from '../ipg/feature-cards';

export interface IsiranTemplateData {
  faq: FaqDefinition;
  sectionForm: IsiranTemplateDataSectionForm;
  getCreditExplanation: SectionExplanation;
  sectionValue: {
    title: string;
    values: FeatureCards[];
  };
  sectionFlow: {
    title: string;
    subtitle: string;
    steps: TimelineSteps[];
  };
}

export interface IsiranTemplateDataSectionForm {
  title: string;
  subtitle: string;
  org: string;
  profile: string;
  fpId: string;
}
