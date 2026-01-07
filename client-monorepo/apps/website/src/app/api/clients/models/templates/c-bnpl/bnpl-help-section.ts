import { LandingElement } from './landing-element';
import { ApiFile } from '../../common/api-file';

export interface BnplHelpSection {
  enum: string;
  icon: ApiFile;
  title: string;
  subtitle?: string;
  items: LandingElement[];
}
