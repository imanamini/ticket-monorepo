import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewUpgComponent } from './new-upg.component';

const routes: Routes = [
  {
    path: '',
    component: NewUpgComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewUpgRoutingModule {
}
