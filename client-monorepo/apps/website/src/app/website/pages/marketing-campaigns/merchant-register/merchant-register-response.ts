import { FaqDefinition } from '../../../../api/clients/models/templates/services/faq';
import {ApiFile} from "../../../../api/clients/models/common/api-file";

export interface merchantRegisterTemplateDataResponse {
  heroSection:HeroSection;
  bannerSection: HeroSection;
  contactFormsId: [{id:string}];
  contentSection: ContentSection[];
  stepsSection: StepsSection;
  merchantsSection: HomeCustomerDefinition;
  registrationForm: registrationForm;
  servicesSection: servicesSection;
  faq: FaqDefinition;
}

export interface HomeCustomerDefinition {
  title: string;
  logos: Array<{
    name: string;
    address: string;
    logoImg: ApiFile;
  }>;
}
export interface HeroSection {
  title: string;
  subtitle: string;
  cta: {
    id: string;
    title: string;
    link: string;
  },
  image: ApiFile;
  qr: ApiFile;
}

export interface ContentSection{
  boldTitle:string,
  description:string,
  mediaAltText:string,
  smallTitle:string,
  media:ApiFile
}
export interface StepsSection {
  title:string;
  desktopImage: ApiFile;
  mobileImage: ApiFile;
}


export interface registrationForm{
  title:string,
  subtitle:string,
}

export interface servicesSection{
  title:string,
  services:Services[]
}

export interface Services{
  title:string,
  icon:ApiFile
}
