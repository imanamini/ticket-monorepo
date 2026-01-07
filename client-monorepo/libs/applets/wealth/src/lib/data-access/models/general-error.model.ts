import { ResponseError } from './response-error.model';

export class GeneralErrorModel extends ResponseError {
  isState?: boolean;
  pageTitle?: string;
  icon?: string;
  actions?: GeneralErrorActionModel[] = [];
}

export class GeneralErrorActionModel {
  title: string = '';
  url?: string;
  type?: string;
  width?: string;
}

export enum EGeneralErrorCode {
  TRANSACTIONS_NOT_FOUND = 1,
}
