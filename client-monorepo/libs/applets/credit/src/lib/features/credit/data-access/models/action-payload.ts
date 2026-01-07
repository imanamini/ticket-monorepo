import { RedirectionTypeEnum } from './redirection-type.enum';

export type RedirectPayload = {
  url: string;
  replaceUrl?: boolean;
  params?: { [key: string]: string | number | boolean };
  state?: { [key: string]: string };
  type?: RedirectionTypeEnum;
  hybridCloseAction?: boolean;
};
