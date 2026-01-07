import { ApiResultInterface } from '@client-monorepo/common/network';

export interface UserDetailResponse {
  result: ApiResultInterface;
  userDetail: UserDetails;
}

export interface UserDetails {
  cellNumber: string;
  userId: string;
  active: boolean;
  imageId: string;
  name: string;
  surname: string;
}
