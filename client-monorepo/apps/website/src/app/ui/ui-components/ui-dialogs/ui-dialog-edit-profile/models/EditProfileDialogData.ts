import { LoggedInUser } from '../../../../../api/digipay/models/logged-in-user.model';
import { SafeStyle } from '@angular/platform-browser';

export interface EditProfileDialogData {
  userData: LoggedInUser;
  userProfileImage: SafeStyle | null;
}
