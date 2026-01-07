import { BnplHelpSection } from '../../c-bnpl/bnpl-help-section';
import { ButtonCta } from '../../../../../../ui/models/button-cta';
import { FaqDefinition } from '../../services/faq';
import { SeoContent } from '../../../../../../ui/ui-components/ui-seo/seo-content';

export interface ProvidersTemplateData {
  collateralTabs: Array<CollateralTabs>;
  sectionSeoContent: SeoContent;
  faq: FaqDefinition;
}

export interface CollateralTabs {
  stepChequeAccordion: BnplHelpSection;
  stepContractAccordion: BnplHelpSection;
  stepTermAccordion: BnplHelpSection;
  stepDeadlineAccordion: BnplHelpSection;
  stepRefundAccordion: BnplHelpSection;
  stepEnoteAccordion: BnplHelpSection;
  modals: ProvidersModals[];
  collateralType: string;
}

export interface ProvidersModals {
  id: string;
  title: string;
  content: string;
  noticeTitle: string;
  notices: Array<{
    text: string;
  }>;
  firstCta: ButtonCta;
}
