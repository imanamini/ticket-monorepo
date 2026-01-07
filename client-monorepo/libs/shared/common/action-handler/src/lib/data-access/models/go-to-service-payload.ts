import { FrequentServicesIdEnum } from '@client-monorepo/common/service-data';

export interface GoToServicePayload {
  serviceId: FrequentServicesIdEnum;
  params?: { [key: string]: string | number | boolean };
  closeServiceUrl?: string;
}
