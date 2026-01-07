import {ApiFile} from "../../common/api-file";
import {FaqDefinition} from "../services/faq";

export interface blackFridayTemplateData {
  categorizedProducts: {
    title: string,
    categories: Array<categoriesProducts>
  },
  hotDeals:{
    title: string,
    subtitle: string,
    narrowTitle: string,
    products: Array<{
      image: ApiFile,
      link: string | null
    }>
  },
  merchants: {
    title: string,
    categories: Array<{
      title: string,
      products: Array<{
        image: ApiFile,
        link: string | null
      }>
    }>
  },
  promotion: {
    narrowTitle: string | null,
    boldTitle: string | null,
    subtitle: string | null,
    image: ApiFile | null,
    cta: {
      title: string | null,
      link: string | null
    } | null
  },
  prize: {
    title: string,
    subtitle: string | null,
    desktopImage: ApiFile | null,
    mobileImage: ApiFile | null,
  },
  introSection: {
    title: string,
    subtitle: string,
    primaryCta: {
      link: string,
      title: string
    },
    secondaryCta: {
      link: string,
      title: string
    },
    deadline:number
  },
  faq: FaqDefinition;
}


export interface categoriesProducts {
  name: string,
  key: string | null,
  products: Array<{
    image: ApiFile,
    link: string | null
  }>
}
