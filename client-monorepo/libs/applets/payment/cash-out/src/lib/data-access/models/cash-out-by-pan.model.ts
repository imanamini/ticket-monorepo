import {CardProfile} from '@client-monorepo/daily-fintech/bank-card';

export interface CashOutDataByPanData {
  type?: string | number;
  value?: string;
  prefix?: string;
  postfix?: string;
  nationalId?: string;
  targetPan?: object;
  profile?: CardProfile;
  expireDate?: string;
  birthDateTimeStamp?: number;
}
