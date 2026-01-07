import {ApiFile} from "../../common/api-file";
import {FaqDefinition} from "../services/faq";

export interface BnplOnboardingTemplateData {
  heroSection: heroSection,
  bnplUsage: bnplUsage,
  finalSection: finalSection,
  purchaseSteps: purchaseSteps,
  visualIntro: visualIntro,
  textIntro:textIntro,
  faq: FaqDefinition;
}


export interface bnplUsage {
  title: string,
  subtitle: string,
  categories: Array<bnplUsageCategory>
}

export interface finalSection {
  image: ApiFile,
  hints: Array<{
    icon: ApiFile,
    description: string
  }>
}

export interface heroSection {
  blackTitle: string,
  blueTitle: string,
  images: Array<{
    image: ApiFile
  }>,
  subtitle: string,
  primaryCta: {
    link: string,
    title: string
  },
  secondaryCta: {
    link: string,
    title: string
  }
}

export interface purchaseSteps {
  title: string,
  subtitle: string,
  steps: Array<{
    title: string,
    description: string,
    image: ApiFile
  }>
}

export interface visualIntro {
  title: string,
  description: string,
  video: ApiFile,
  cover:ApiFile,
}

export interface textIntro {
  title: string,
  description: string,
  image: ApiFile
}

export interface bnplUsageCategory {
  title: string;
  key: string;
  image: ApiFile,
  merchants: CategoryMerchant[];
  recappedMerchants?: RecappedMerchant[];
}

export interface CategoryMerchant {
  trackingCode: string;
}

export interface RecappedMerchant {
  title: string;
  logo: string;
}
