import { GenericApiResponse } from '@client-monorepo/common/network';

export interface CardConfigResponse extends GenericApiResponse {
  vaultCert: string;
  externalRegisterDescription: string;
}
