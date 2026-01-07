import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationV3Component } from './registration-v3.component';

const routes: Routes = [
  {
    path: '',
    component: RegistrationV3Component
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistrationV3RoutingModule {
}
