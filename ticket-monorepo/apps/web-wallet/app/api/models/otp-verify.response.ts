import { GenericResponse } from './generic.response';
import { TacFeature } from './tac.response';

export interface OtpVerifyResponse extends GenericResponse {
  features: {
    [key: string]: TacFeature
  };
}
