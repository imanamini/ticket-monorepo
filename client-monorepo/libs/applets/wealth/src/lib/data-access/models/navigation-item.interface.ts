export interface NavigationItemInterface {
  text: string;
  icon?: string;
  link: string;
  subMenus?: Array<NavigationItemInterface>;
  isActive?: boolean;
}
