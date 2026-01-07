import { ApiResultInterface } from '@client-monorepo/common/network';

export type UserFeaturesApiResponse = {
  result: ApiResultInterface;
  features: Record<number, UserFeature>;
};

export type UserFeature = {
  isProtected: number;
  protectionState?: PROTECTIONS;
  editable?: boolean;
  title?: string;
  url?: string;
};

export enum PROTECTIONS {
  NONE = 0,
  PIN = 1,
  OTP = 2,
  IN_APP_VERIFICATION = 3,
}
