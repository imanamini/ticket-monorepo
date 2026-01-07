import {BnplUsage, Faq} from "../c-credit/c-credit-v2-template-data";
import {ApiFile} from "../../common/api-file";
import {purchaseSteps} from "../bnpl-onboarding/bnpl-onboarding-template-data";
import {SeoContent} from "../../../../../ui/ui-components/ui-seo/seo-content";

export interface CBnplV2Template {
  sectionIntro: intro,
  benefitSection: benefit,
  bnplUsage: BnplUsage,
  installmentBnplSection: installment,
  installmentRepayment: installment,
  plans: plans,
  purchaseSteps: purchaseSteps,
  sectionSeoContent: SeoContent,
  faq: Faq
}

export interface intro {
  sectionTextual: {
    blackTitle: string
    blueTitle: string,
    subtitle: string,
    ctaPrimary: {
      icon: null,
      id: null,
      title: string,
      link: string
    },
    ctaSecondary: {
      icon: null,
      id: null,
      title: string,
      link: string
    }
  }
  sectionSlider: {
    desktopImageSlider: ApiFile,
    desktopImageLabels:Array<{ labelImage: ApiFile }>,
    mobileSlider: Array<{ image: ApiFile }>
  }
}

export interface benefit {
  title: string,
  benefits: Array<{
    image: ApiFile,
    description: string
  }>,
  cta: {
    icon: null,
    id: null,
    title: string,
    link: string
  }
}

export interface installment {
  title: string,
  subtitle: string,
  image: ApiFile
}

export interface plans {
  boldTitle: string,
  thinTitle: string,
  subtitle: string,
  plans: Array<{
    backSideImageMobile: ApiFile,
    backSideImageDesktop: ApiFile,
    frontSideContent: {
      title: string,
      subtitle: string,
      description: string
      planImage: ApiFile
    }
  }>
}
