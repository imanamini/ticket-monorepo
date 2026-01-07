import {LandingElement} from './landing-element';

export interface BnplHelpSection {
  menuTitle: string;
  title: string;
  subTitle?: string;
  items: LandingElement[];
}
