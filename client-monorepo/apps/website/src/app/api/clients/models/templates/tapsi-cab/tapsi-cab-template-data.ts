import {ApiFile} from "../../common/api-file";
import {FaqDefinition} from "../services/faq";

export interface TapsiCabTemplateData {
  introSection: {
    cta: {
      link: string,
      text: string
    },
    subtitle: string,
    mainTitle: string
  },
  noteSection: NoteSection,
  paySteps: PaySection,
  propositionSection: Array<{
    mobileImage: ApiFile,
    desktopImage: ApiFile,
  }>,
  faq: FaqDefinition;
}

export interface NoteSection {
  text: string,
  cta: {
    text: string,
    link: string
  }
}

export interface PaySection {
  blackTitle: string,
  blueTitle: string,
  description: string,
  history: Array<{
    title: string,
    subtitle: string,
    description: string,
    mobileImage: ApiFile,
    desktopImage: ApiFile,
  }>
}
