import { ApiResultInterface } from '@client-monorepo/common/network';
import { ProfileInterface } from './profile.interface';

export interface UserProfileInterface {
  result: ApiResultInterface;

  userDetail: ProfileInterface;
}
