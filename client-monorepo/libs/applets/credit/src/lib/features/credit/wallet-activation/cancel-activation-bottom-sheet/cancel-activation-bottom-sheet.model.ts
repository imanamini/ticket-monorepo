import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';

export interface SelectReasonsOption {
  value: string;
  label: string;
  inputEnabled: boolean;
}

export enum CancelActivationMessageAction {
  CLOSE = 'CLOSE',
  CONFIRM = 'CONFIRM',
  READY_TO_ARCHIVE_DONE = 'READY_TO_ARCHIVE_DONE',
}

export interface CancelActivationMessage {
  image: 'done' | 'question' | 'error';
  title: string;
  description: string;
  buttons: Buttons[];
}
