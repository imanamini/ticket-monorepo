import { APP_NAME_ENUM } from '@client-monorepo/common/utilities';

export interface ProfileMenuGroupItemInterface {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: string;
  link?: string | Array<string>;
  disabled?: boolean;
  isEmitter?: boolean;
  apps?: APP_NAME_ENUM[];
}

export interface ProfileMenuGroupInterface {
  title: string;
  menu: Array<ProfileMenuGroupItemInterface>;
}
