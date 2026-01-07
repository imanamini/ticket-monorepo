export interface ProfileMenuItemInterface {
  title: string;
  icon?: string | undefined;
  link?: string | Array<string>;
  disabled?: boolean;
  comingSoon?: boolean;
  hasArrow:boolean;
  isEmitter?: boolean;
}
