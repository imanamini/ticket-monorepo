import { GenericApiResponse } from '../generic-api-response.model';

export interface Feature {
  editable: boolean;
  isProtected: number;
  title: string;
  url: string;
}

export interface InAppTacResponse extends GenericApiResponse {
  shouldAcceptTac: boolean;
  tacUrl: string;
  userDetail: {
    userId: string;
    cellNumber: string;
    active: boolean;
  };
  features: {
    [key: string]: Feature;
  };
  gateways: Array<number>;
}
