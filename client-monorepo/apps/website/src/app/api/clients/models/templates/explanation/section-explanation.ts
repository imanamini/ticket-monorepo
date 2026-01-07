import { ValueCards } from '../../../../../ui/models/value/value-cards';
import { ApiFile } from '../../common/api-file';
import { ButtonCta } from '../../../../../ui/models/button-cta';

export interface SectionExplanation {
  title: string;
  subtitle: string;
  description: string;
  values: ValueCards[];
  artwork: ApiFile;
  firstCta: ButtonCta;
}
