import { WebsiteMenuItem } from '../../api/clients/models/layout/menus.response';
import { BaseRecommendation } from '../../api/digipay/models/recommendation/base-recommendation';

export interface StorageSchema {
  menuItems?: WebsiteMenuItem[];
  lastMenuDigest?: string;
  userInfo?: {
    name?: string;
    email?: string;
  };
  auth?: {
    userId?: string;
    access?: string;
    refresh?: string;
  };
  cachedNumbers?: BaseRecommendation[];
  insiderBody?: any;
  readBadges?: string[];
  inApp?: number;
  tokenExpiryTime?: number;
  trackingCode?: string;
}
