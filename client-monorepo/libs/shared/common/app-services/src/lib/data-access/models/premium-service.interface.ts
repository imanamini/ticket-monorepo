import { FrequentServicesIdEnum } from '@client-monorepo/common/service-data';

export interface PremiumServiceInterface {
  id: FrequentServicesIdEnum;
  title: string;
  icon: string;
  primaryColor: string;
  secondaryColor: string;
}
