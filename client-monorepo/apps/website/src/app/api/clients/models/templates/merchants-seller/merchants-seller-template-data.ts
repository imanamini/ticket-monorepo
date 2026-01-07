import { FaqDefinition } from '../services/faq';
import { ApiFile } from '../../common/api-file';

export interface MerchantsSellerTemplateData {
  calculator: Calculator;
  faq: FaqDefinition;
  sectionBanner: SectionBanner;
  sectionBenefits: SectionBenefits;
}

export interface SectionBanner {
  subtitle: string;
  title: string;
  desktopBanner: ApiFile;
  mobileBanner: ApiFile;
  tabletBanner: ApiFile;
  firstCta: FirstCta;
}

export interface FirstCta {
  title: string;
  id: number;
  color: string;
  backgroundColor: string;
}

export interface SectionBenefits {
  benefitsTitle: string;
  items: Array<{
    title: string;
    subTitle: string;
    icon: ApiFile;
  }>;
}

export interface Calculator {
  title: string;
  subtitle: string;
  defaultAmount: string;
  formButton: FormButton;
  providerTitle: string;
  recipeTitle: string;
  amountTitle: string;
  installmentCountTitle: string;
  providers: Provider[];
}

export interface FormButton {
  id: string;
  title: string;
  link: string;
}

export interface Provider {
  collateral: string;
  icon: ApiFile;
  infrastructureCost: string;
  name: string;
  profit: number;
}
