import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DigitalSignRedirectionComponent } from './digital-sign-redirection/digital-sign-redirection.component';

const routes: Routes = [
  {
    path: '',
    component: DigitalSignRedirectionComponent,
    canActivate: [],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DigitalSignRedirectionRoutingModule {
}
