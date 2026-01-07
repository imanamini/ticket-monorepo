import { FeatureCards } from '../../api/clients/models/templates/ipg/feature-cards';

export interface SectionBenefits {
  title: string;
  subtitle: string;
  items: FeatureCards[];
}
