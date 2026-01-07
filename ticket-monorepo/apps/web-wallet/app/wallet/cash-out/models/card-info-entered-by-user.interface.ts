import {PanTypeEnum} from "./pan-type.enum";

export interface CardInfoEnteredByUserInterface {
  sourceCardNumber: string,
  expireDate: string,
  value: string;
  type: PanTypeEnum,
  postfix: string,
  prefix: string
}
