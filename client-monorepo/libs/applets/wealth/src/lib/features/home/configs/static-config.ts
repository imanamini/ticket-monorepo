import { ButtonIcon } from '@digipay/ngx-button';
import { NgxAppBarButtonType } from '@digipay/ngx-app-bar';
import { DashboardBanner, DashboardCategory } from '../../../data-access/models/dashboard-parts.model';
import { INVESTMENT_LIST_ROUTE, WALLETS_ROUTE, CROWD_LIST_ROUTE, WALLET_GUIDS } from '../../../data-access/constants/app-routes';

export const WEALTH_BANNERS: DashboardBanner[] = [
  { iconPath: 'wealth-assets/images/golbarg-banner.png', path: INVESTMENT_LIST_ROUTE, bannerId: '11421' },
];

export const WEALTH_SECOND_BANNERS: DashboardBanner[] = [
  { iconPath: 'wealth-assets/images/wealth-banner.png', path: INVESTMENT_LIST_ROUTE, queryParams: 'FixedIncome' },
];

export const DP_BANNERS: DashboardBanner[] = [
  { iconPath: 'wealth-assets/images/home-slider/BANNER_MOTORCYLCE_CAMPAIGN.png', path: WALLET_GUIDS, bannerId: 'treasury', title: 'GUID' },
  { iconPath: 'wealth-assets/images/home-slider/TREASURY_BANNER.png', path: WALLETS_ROUTE, bannerId: 'treasury', title: 'TREASURY' },
  { iconPath: 'wealth-assets/images/home-slider/TREASURY.webp', path: WALLETS_ROUTE, bannerId: 'treasury', title: 'TREASURY' },
  { iconPath: 'wealth-assets/images/home-slider/BANNER_GOLBARG.png', path: INVESTMENT_LIST_ROUTE, bannerId: '11421', title: 'KARDAN' },
  {
    iconPath: 'wealth-assets/images/home-slider/BANNER_KIMIA_ZARRIN_KARDAN.png',
    path: INVESTMENT_LIST_ROUTE,
    bannerId: 'IRTKGANJ0001',
    title: 'KARDAN',
  },
];

export const DP_SECOND_BANNERS: DashboardCategory[] = [
  {
    iconPath: 'wealth-assets/images/gold-card.png',
    path: INVESTMENT_LIST_ROUTE,
    query: 'Gold',
    id: 'GOLD',
    text: 'سرمایه‌گذاری مبتنی بر طلا',
  },
  {
    iconPath: 'wealth-assets/images/mutual-fund-card.png',
    path: INVESTMENT_LIST_ROUTE,
    query: 'FixedIncome',
    id: 'FIXED_INCOME',
    text: 'صندوق‌های درامد ثابت',
  },
  {
    iconPath: 'wealth-assets/images/index-fund-card.png',
    path: INVESTMENT_LIST_ROUTE,
    query: 'Index',
    text: 'صندوق‌های شاخصی',
    id: 'INDEX_FUND',
    comingSoon: false,
  },
  { iconPath: 'wealth-assets/images/crowd-card.png', path: CROWD_LIST_ROUTE, text: 'تامین مالی جمعی', id: 'CROWD', comingSoon: false },
];

export const HEADER_LEFT_BUTTON: NgxAppBarButtonType = {
  mode: 'icon-only',
  size: 'small',
  icon: { name: 'person', type: 'bold' },
};

export const HEADER_LEFT_ICON: ButtonIcon = { name: 'card-to-card', type: 'bold' };
