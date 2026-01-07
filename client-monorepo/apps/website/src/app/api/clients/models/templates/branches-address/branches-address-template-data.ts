import { ApiFile } from '../../common/api-file';
import { PromotionBanner } from '../warranty/warranty-template-data';
import {SeoContent} from "../../../../../ui/ui-components/ui-seo/seo-content";
import {FaqDefinition} from "../services/faq";
import {Registering} from "../c-credit/c-credit-template-data";

export interface BranchesAddressTemplateData {
  sectionValueProposition: sectionValueProposition,
  sectionAddress :sectionAddress,
  sectionRegistering:Registering,
  sectionSeoContent:SeoContent,
  faq:FaqDefinition
}


export interface sectionValueProposition {
  title: string;
  description: string;
  values : Array<{
    image: ApiFile;
    subtitle: string;
  }>
}

export interface sectionAddress {
  title: string;
  addresses: Array<{
    title: string;
    address: string;
    link: string;
    open: string;
    city:string;
    district:string;
    phone:string
  }>;
}


