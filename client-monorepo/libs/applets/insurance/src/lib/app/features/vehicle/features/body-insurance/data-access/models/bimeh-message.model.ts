import { BimehMessageType } from './bimeh-message-type.enum';

export interface BimehMessageModel {
  type: BimehMessageType;
  payload: string;
}