import { ApiResultInterface } from '@client-monorepo/common/network';
import { DeviceInfo } from '@client-monorepo/common/utilities';
import { UserFeature } from '@client-monorepo/common/user';
import { TransactionType } from '@client-monorepo/payment/transactions';

export interface TacResponse {
  result: ApiResultInterface;
  shouldAcceptTac: boolean;
  userDetail: UserDetail;
  helpURL: string;
  tacUrl: string;
}

export interface UserDetail {
  userId: string;
  name: string;
  surname: string;
  cellNumber: string;
  nationalCode: string;
  email: Email;
  imageId: string;
  phone: Phone;
  active: boolean;
  birthDate: number;
  gender: number;
}

export interface Email {
  email: string;
  status: number;
}

export interface Phone {
  number: string;
  status: number;
}

export interface TacDeviceModel {
  device: DeviceInfo;
  appVersion: string;
  pushNotifToken?: string;
}

export interface InAppTacResponse {
  result: ApiResultInterface;
  shouldAcceptTac: boolean;
  tacUrl: string;
  userDetail: {
    userId: string;
    cellNumber: string;
    active: boolean;
  };
  features: {
    [key: string]: UserFeature;
  };
  gateways: Array<number>;
  transactionType?: TransactionType;
}
