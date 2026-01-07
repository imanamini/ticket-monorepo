import { ResponseError } from '../response-error.model';

export class ServiceResult {
  constructor(
    public error: ResponseError | any,
    public message: string,
    public success: boolean,
  ) {
  }
}

