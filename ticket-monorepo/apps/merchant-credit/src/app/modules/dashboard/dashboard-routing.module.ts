import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent, WelcomePageComponent } from './pages';
import { DashboardComponent } from './dashboard.component';
import { DashboardResolver } from './sandbox/services/dashboard.resolver';

const routes: Routes = [
  {
    path: ':ticket',
    component: DashboardComponent,
    resolve: {data: DashboardResolver},
    children: [
      {
        path: 'welcome',
        component: WelcomePageComponent,
      },
      {
        path: 'home',
        component: HomePageComponent,
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {
}
