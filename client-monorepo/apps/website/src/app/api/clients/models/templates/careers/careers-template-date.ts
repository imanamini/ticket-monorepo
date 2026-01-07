import {ApiFile} from "../../common/api-file";
import {customGallery, honors} from "../about-us/about-us-template-data";

export interface careersTemplateData {
  heroSection: heroSection,
  benefitsSection: benefitsSection,
  joinFlowSection: joinFlowSection,
  sectionValue: sectionValue
}

export interface heroSection {
  description: string,
  link: string,
  longVideo: ApiFile,
  shortVideo: ApiFile,
  subtitle: string,
  title: string,
}

export interface benefitsSection {
  description: string,
  title: string,
  values: Array<{
    title: string,
    icon: ApiFile,
  }>,
}

export interface joinFlowSection {
  title: string,
  subtitle: string,
  mobileImage: ApiFile,
  gallery: Array<customGallery>,
  desktopImage: ApiFile,
}

export interface sectionValue {
  title: string,
  subtitle: string,
  values: Array<{
    title: string,
    description: string,
    icon: ApiFile
  }>
}
