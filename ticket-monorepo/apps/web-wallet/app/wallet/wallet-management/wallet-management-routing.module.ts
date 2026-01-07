import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WalletManagementComponent } from './wallet-management.component';

const routes: Routes = [
  {
    path: '', component: WalletManagementComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WalletManagementRoutingModule {
}
