import { ApiFile } from '../common/api-file';
import { ButtonCta } from '../../../../ui/models/button-cta';

export interface MenusResponse {
  digest: string;
  menus: WebsiteMenuItem[];
}

export interface WebsiteMenuItem {
  label: string;
  position: string;
  banner: WebsiteMenuBanner;
  children: WebsiteMenuItemChildren[];
}

export interface WebsiteMenuItemChildren {
  title: string;
  url: string;
  menu: {
    title: string;
    menuStyle: string;
    menuItemsType: string;
    menuItemsEntity: string;
    apiEntity: string;
    menuItems: Array<{
      id: string;
      title: string;
      subtitle: string;
      url: string;
      target: string;
      slug: string;
    }>;
  };
  groups: Array<{
    displayMode: string;
    entity: string;
    banner: WebsiteMenuBanner;
    items: Array<{
      imagePath: ApiFile;
      title: string;
      subtitle: string;
      color: string;
      url: string;
      ctaText: string;
      createdAtAgo: string;
      slug: string;
      image: ApiFile;
    }>;
  }>;
}

export interface WebsiteMenuBanner {
  title: string;
  subtitle: string;
  firstCta: ButtonCta;
}
