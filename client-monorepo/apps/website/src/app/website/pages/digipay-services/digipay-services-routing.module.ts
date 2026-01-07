import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DigipayServiceComponent } from './digipay-service/digipay-service.component';

const routes: Routes = [
  {
    path: ':slug',
    component: DigipayServiceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DigipayServicesRoutingModule {
}
