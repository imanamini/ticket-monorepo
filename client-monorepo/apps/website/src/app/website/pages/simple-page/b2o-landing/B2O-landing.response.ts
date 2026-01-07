import { HeroSection } from '../../../../api/clients/models/common/heroSection';
import { registrationForm } from '../../../../api/clients/models/common/registrationForm';
import { ApiFile } from '../../../../api/clients/models/common/api-file';

export interface B2OLandingTemplateDateResponse {
  sectionCounter: HeroSection;
  financialServicesSection: financialServices;
  contactFormsId: [{ id: string }];
  registrationForm: registrationForm;
  digipayServicesSection: digipayServicesSection;
}

export interface digipayServicesSection {
  title: string;
  items: Services[];
}

export interface financialServices {
  title: string;
  description: string;
  subtitle: string;
  values: financialServicesList[];
}

export interface financialServicesList {
  valueText: string;
  valueTitle: string;
  valueIcon: ApiFile;
}

export interface Services {
  featureIcon: ApiFile;
  featureText: string;
  featureTitle: string;
  usageList: usage[];
}

export interface usage {
  usage: string;
}
