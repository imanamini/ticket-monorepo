import { ServiceResult } from './service-result';

export class TServiceResult<T> extends ServiceResult {
  constructor(
    retVal: T,
    message: string,
    error: any,
    success: boolean,
  ) {
    super(error, message, success);
    this.result = retVal;
  }

  result: T;
}
