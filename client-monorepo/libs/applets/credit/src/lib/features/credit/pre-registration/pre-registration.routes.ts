import { Route } from '@angular/router';

export const preRegistrationRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./pre-registration-step-control/pre-registration-step-control.component').then((c) => c.PreRegistrationStepControlComponent),
    title: 'طرح‌های اعتباری',
    data: { preload: true, critical: true },
  },
  {
    path: 'detail/:planId/:groupId',
    loadComponent: () =>
      import('./pre-registration-group-detail/pre-registration-group-detail.component').then((c) => c.PreRegistrationGroupDetailComponent),
    title: 'اطلاعات تکمیلی',
    data: { preload: true, critical: true },
  },
  {
    path: 'submit/:planId/:groupId',
    loadComponent: () => import('./pre-registration-form/pre-registration-form.component').then((c) => c.PreRegistrationFormComponent),
    title: 'اطلاعات پایه',
    data: { preload: true, critical: true },
  },
  {
    path: 'underwriter',
    loadComponent: () =>
      import('./pre-registration-by-underwriter/pre-registration-by-underwriter.component').then(
        (c) => c.PreRegistrationByUnderwriterComponent,
      ),
  },
  {
    path: 'failed',
    loadComponent: () =>
      import('./pre-registration-failed/pre-registration-failed.component').then((c) => c.PreRegistrationFailedComponent),
    title: 'دریافت وام',
  },
];
