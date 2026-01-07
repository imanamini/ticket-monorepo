import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MerchantsDigikalaComponent } from './sub-pages/merchants-digikala/merchants-digikala.component';
import { MerchantsComponent } from './merchants.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: MerchantsComponent,
  },
  {
    path: 'digikala',
    component: MerchantsDigikalaComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MerchantsRoutingModule {
}
