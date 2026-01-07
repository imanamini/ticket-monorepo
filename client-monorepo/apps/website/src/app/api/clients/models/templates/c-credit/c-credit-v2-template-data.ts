import { SeoContent } from '../../../../../ui/ui-components/ui-seo/seo-content';
import { ApiFile } from '../../common/api-file';

export interface CCreditV2TemplateData {
  faq: Faq
  pathPrefix: string
  sectionIntro: SectionIntro
  sectionValueProposition: SectionValueProposition
  bnplUsage: BnplUsage
  sectionRegistration: SectionRegistration
  sectionSeoContent: SeoContent
}

export interface Faq {
  title: string
  subtitle: string
  categoryId: any
  faqItems: FaqItem[]
}

export interface FaqItem {
  question: string
  answer: string
  snippet: any
}

export interface SectionIntro {
  sectionTextual: SectionTextual
  cardSection: CardSection
}

export interface SectionTextual {
  subtitle: string
  smallTitle: string
  boldTitle: string
  sectionMerchants: SectionMerchants
  firstCta: FirstCta
  secondCta: SecondCta
}

export interface SectionMerchants {
  link: any
  logos: Logo[]
}

export interface Logo {
  logo: ApiFile;
}

export interface FirstCta {
  icon: any
  id: any
  title: string
  link: any
}

export interface SecondCta {
  icon: any
  id: any
  title: string
  link: any
}

export interface CardSection {
  cardImage: ApiFile;
  cardTitle: any;
  maxCredit: any;
  installmentPeriod: any;
}

export interface SectionValueProposition {
  title: string
  values: Value[]
}

export interface Value {
  image: Image
  title: string
  description: string
}

export interface Image {
  path: string
  url: string
  name: string
  altText: string
}

export interface BnplUsage {
  title: string
  subtitle: string
  categories: Category[]
}

export interface Category {
  title: string
  key: any
  image: any
  merchants: any[]
}

export interface SectionRegistration {
  title: string
  description: string
  button: Button
  valuePropositions: ValueProposition[]
  backgroundImage: any
}

export interface Button {
  id: any
  title: string
  link: any
}

export interface ValueProposition {
  image: ApiFile
  text: string
}

