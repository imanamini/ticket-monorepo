export enum ErrorImageType {
  TYPE_1 = 'TYPE_1',
  TYPE_2 = 'TYPE_2',
  TYPE_3 = 'TYPE_3',
  TYPE_4 = 'TYPE_4',
}

export enum ErrorCtaType {
  RETURN_TO_HOME = 'RETURN_TO_HOME',
  RETRY = 'RETRY',
}

export interface ErrorConfig {
  title: string;
  message: string;
  image: ErrorImageType;
  cta: ErrorCtaType;
}
