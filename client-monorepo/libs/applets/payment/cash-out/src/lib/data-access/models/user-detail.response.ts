import {ApiResultInterface} from '@client-monorepo/common/network';
import {UserDetails} from './user-details';

export interface UserDetailResponse {
  result:ApiResultInterface,
  userDetail: UserDetails;
}
