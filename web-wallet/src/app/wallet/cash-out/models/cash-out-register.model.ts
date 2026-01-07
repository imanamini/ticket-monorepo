import { PanTypeEnum } from './pan-type.enum';

export interface CashOutRegisterModel {
  type?: string;
  amount?: number;
  nationalCode?: string;
  certFile?: string;
  targetPan: TargetPan;
}

export interface TargetPan {
  expireDate?: string;
  postfix?: string;
  prefix?: string;
  type: PanTypeEnum;
  value: string;
}
