import { ButtonCta } from './button-cta';
import { ApiFile } from '../../api/clients/models/common/api-file';

export interface UiAccordion {
  title: string;
  steps: Steps[];
  firstCta: ButtonCta;
}

export interface Steps {
  icon: ApiFile;
  title: string;
  text: string;
}
