import { ApiFile } from '../../common/api-file';
import { FaqDefinition } from '../services/faq';
import { TimelineSteps } from '../../../../../ui/models/timeline-steps';
import { RelatedPosts } from '../blog/related-posts';

export interface MerchantCreditTemplateData {
  faq: FaqDefinition;
  relatedPosts: RelatedPosts;
  introTitle: string;
  introSubtitle: string;
  introSubtitle2: string;
  introFirstCta: {
    title: string;
    link: string;
  };
  introArtwork: ApiFile;
  introType: string;
  rapidSettlementExplanation: {
    title: string;
    description: string;
    notice: string;
    videoCoverImage: ApiFile;
    video: ApiFile;
  };
  calculator: {
    mainTitle: string;
    mainSubtitle: string;
    secondaryTitle: string;
    videoCoverImage: ApiFile;
    bankCommission: {
      text: string;
      icon: ApiFile;
    };
    serviceCommission: {
      text: string;
      icon: ApiFile;
    };
    finalDeposit: {
      text: string;
      icon: ApiFile;
    };
    notice: string;
  };
  registrationStepsTitle: string;
  merchantSteps: {
    title: string;
    steps: TimelineSteps[];
  };
  distributorSteps: {
    title: string;
    steps: TimelineSteps[];
  };
  mainForm: {
    title: string;
    description: string;
    notice: string;
  };
}
