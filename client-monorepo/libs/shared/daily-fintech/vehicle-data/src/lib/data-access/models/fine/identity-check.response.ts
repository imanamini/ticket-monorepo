import { GenericApiResponse } from '@client-monorepo/common/network';

export interface IdentityCheckResponse extends GenericApiResponse {
  plateOwner: {
    cellNumber: string;
    name: string;
    nationalCode: string;
    userId: string;
  };
}
