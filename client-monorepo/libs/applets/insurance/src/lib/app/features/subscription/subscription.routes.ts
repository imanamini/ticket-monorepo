import { Route } from '@angular/router';
import { CompleteInfoComponent } from './features/complete-info/complete-info.component';
import { UploadImagesComponent } from './features/upload-images/upload-images.component';
import { HealthCheckComponent } from './features/health-check/health-check.component';
import { SubscriptionComponent } from './subscription.component';
import { CompleteJourneyComponent } from './features/complete-journey/complete-journey.component';

export const SUBSCRIPTION_ROUTES: Route[] = [
  {
    path: '',
    component: SubscriptionComponent,
    children: [
      {
        path: 'complete-info',
        component: CompleteInfoComponent
      },
      {
        path: 'upload-images',
        component: UploadImagesComponent
      },
      {
        path: 'health-check',
        component: HealthCheckComponent
      },
      {
        path: 'complete-journey',
        component: CompleteJourneyComponent
      },
    ]
  },
];
