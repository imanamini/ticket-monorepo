import { Route } from '@angular/router';

export const profileRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./features/profile/profile.component').then((c) => c.ProfileComponent),
  },
  {
    path: 'about-us',
    loadComponent: () => import('./features/about-us/about-us.component').then((c) => c.AboutUsComponent),
  },
  {
    path: 'saved-cards',
    loadChildren: () => import('./features/saved-cards/saved-cards.routes').then((r) => r.SavedCardsRoutes),
  },
  {
    path: 'rules',
    loadComponent: () =>
      import('./features/terms-and-conditions/terms-and-conditions.component').then((c) => c.TermsAndConditionsComponent),
  },
  {
    path: 'manage-password',
    loadComponent: () => import('./features/manage-password/manage-password.component').then((c) => c.ManagePasswordComponent),
  },
  {
    path: 'chatbot',
    loadComponent: () => import('./features/chatbot/chatbot.component').then((c) => c.ChatbotComponent),
  },
  // {
  //   path: 'feedback',
  //   loadComponent: () => import('./features/feedback/feedback.component').then((c) => c.FeedbackComponent),
  // },
  {
    path: 'guide/:mode',
    loadComponent: () => import('./features/guide/guide.component').then((c) => c.GuideComponent),
  },
  {
    path: 'user',
    loadComponent: () => import('./features/user-info/user-info.component').then((c) => c.UserInfoComponent),
  },
  {
    path: 'referral',
    loadComponent: () => import('./features/referral/referral.component').then((c) => c.ReferralComponent),
  },
  {
    path: 'update',
    loadComponent: () => import('./features/update-version/update-version.component').then((c) => c.UpdateVersionComponent),
  },
  {
    path: 'sessions',
    loadComponent: () => import('./features/sessions/sessions.component').then((c) => c.SessionsComponent),
  },
];
