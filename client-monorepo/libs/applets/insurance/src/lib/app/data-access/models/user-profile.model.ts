import { LoggedInUser } from './logged-in-user.model';

export interface UserProfileModel {
  result: {
    title: string,
    status: number,
    message: string,
    level: string
  };
  userDetail: LoggedInUser;
}
