export interface OperationResultModel {
  title?: string;
  description?: string;
  img?: string;
  submitText?: string;
}

export interface CloseModalInterface {
  state: 'CLOSE' | 'SUBMIT';
}

