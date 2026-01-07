import { ApiFile } from '../../api/clients/models/common/api-file';
import { ButtonCta } from './button-cta';

export interface TimelineSteps {
  title: string;
  text?: string;
  icon?: ApiFile;
  firstCta?: ButtonCta;
  modal?: {
    title: string;
    description: string;
    firstCta: {
      title: string;
      link: string;
    };
    secondCta: {
      title: string;
      link: string;
    };
  };
}
