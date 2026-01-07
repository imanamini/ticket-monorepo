import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./careers-home/careers-home.component').then((m) => m.CareersHomeComponent),
  },
  {
    path: 'job/:id',
    loadComponent: () => import('./careers-job-page/careers-job-page.component').then((m) => m.CareersJobPageComponent),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CareersRoutingModule {}
