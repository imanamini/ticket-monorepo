export interface RoutesStaticItems {
  [key: string]: RouteConfig;
}

export interface RouteConfig {
  engTitle?: string;
  title?: string;
  breadCrumbTitle?: string;
  route?: string;
  icon?: string;
  description?: string;
  showInNavigation?: boolean;
  queryParam?: string;
  children?: RouteConfig[];
  id?: number;
}




