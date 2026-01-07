export interface DashboardBanner {
  path: string;
  iconPath: string;
  bannerId?: string;
  queryParams?: string;
  title?: string;
}

export interface DashboardCategory {
  id?: string;
  path?: string;
  iconPath: string;
  categoryId?: string;
  query?: string;
  text?: string;
  comingSoon?: boolean;
  className?: string;
}
