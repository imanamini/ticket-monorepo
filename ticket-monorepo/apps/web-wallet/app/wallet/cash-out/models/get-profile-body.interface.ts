import { PanTypeEnum } from './pan-type.enum';

export interface GetProfileBodyInterface {
  certFile: string,
  pan: {
    expireDate: string,
    postfix: string,
    prefix: string,
    type: PanTypeEnum,
    value: string
  }
}
