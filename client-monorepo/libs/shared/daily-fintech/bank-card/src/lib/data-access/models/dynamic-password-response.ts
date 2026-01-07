import { GenericApiResponse } from '@client-monorepo/common/network';

export interface DynamicPasswordResponse extends GenericApiResponse {
  validityDuration: number;
}
