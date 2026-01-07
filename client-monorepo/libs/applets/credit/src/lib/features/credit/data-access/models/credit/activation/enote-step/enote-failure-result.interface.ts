import { EnoteFailureType } from './enote-failure-type.enum';

export interface EnoteFailureResultInterface {
  failureType: EnoteFailureType;
  description: string;
}
