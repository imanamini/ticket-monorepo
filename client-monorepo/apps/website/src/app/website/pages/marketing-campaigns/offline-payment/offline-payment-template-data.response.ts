import { FaqDefinition } from '../../../../api/clients/models/templates/services/faq';
import {CBnplStores} from "../../../../api/clients/models/templates/c-bnpl-v2/c-bnpl-v2-template-data.response";
import {ApiFile} from "../../../../api/clients/models/common/api-file";

export interface OfflinePaymentTemplateDataResponse {
  heroSection: HeroSection;
  valuePropositionSection: ValuePropositionSection;
  media: ApiFile;
  stepsSection: StepsSection
  cBnplStores: CBnplStores;
  faq: FaqDefinition;
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

export interface ValuePropositionSection {
  title:string,
    items: Array<{
    icon: ApiFile;
    description: string;
    subDesc: string;
  }>;
}

export interface StepsSection {
  title:string;
  subtitle:string;
  desktopImage: ApiFile;
  mobileImage: ApiFile;
  firstCta: {
    id: string;
    title: string;
    link: string;
  },
  secondCta: {
    id: string;
    title: string;
    link: string;
  },
  thirdCta: {
    id: string;
    title: string;
    link: string;
  },
}
