import { Injectable } from '@angular/core';
import { ResponseError } from '../../../data-access/models/response-error.model';
import { GeneralErrorModel } from '../../../data-access/models/general-error.model';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  private errorParams: ResponseError | null = null;
  private generalError: GeneralErrorModel | null = null;
  private expiredError: boolean | null = null;

  setParams(params: ResponseError): void {
    this.errorParams = params;
  }

  getParams(): ResponseError | null {
    return this.errorParams;
  }

  clearParams(): void {
    this.errorParams = null;
  }

  setGeneralError(error: GeneralErrorModel) {
    this.generalError = error;
  }

  getGeneralError(): GeneralErrorModel | null {
    return this.generalError;
  }

  cleareGeneralError() {
    this.generalError = null;
  }

  isErrorPageExpired() {
    return this.expiredError;
  }

  setErrorPageExpired(value) {
    this.expiredError = value;
  }
}
