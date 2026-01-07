import { LoggedInUser } from './logged-in-user.model';
import { ApiResult } from './api-result.model';

export interface UserProfileResponse {
  result: ApiResult;
  userDetail: LoggedInUser;
}
