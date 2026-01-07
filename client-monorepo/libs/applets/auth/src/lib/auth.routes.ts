import { Route } from '@angular/router';
import { noAuthGuard } from './data-access/guards/no-auth.guard';

export const authRoutes: Route[] = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then((c) => c.LoginComponent),
    canActivate: [noAuthGuard],
  },
  {
    path: 'premium-services',
    loadComponent: () => import('./features/premium-services/premium-services.component').then((c) => c.PremiumServicesComponent),
    canActivate: [noAuthGuard],
  },
  {
    path: 'setting',
    loadComponent: () => import('./features/app-setting/app-setting.component').then((c) => c.AppSettingComponent),
  },
  {
    path: 'callback',
    loadComponent: () => import('./features/trusted-login/trusted-login.component').then((c) => c.TrustedLoginComponent),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
