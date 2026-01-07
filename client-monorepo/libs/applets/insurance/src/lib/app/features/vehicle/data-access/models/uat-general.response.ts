import { ErrorResponseModel } from './third-party/error-response.model';

export interface UatGeneralResponse<T> {
  success: boolean;
  result: T;
  error?: ErrorResponseModel;
  errors?: ErrorResponseModel[];
}
