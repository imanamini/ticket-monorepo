import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BackupAccountComponent } from './backup-account.component';

const routes: Routes = [
  {path: '', component: BackupAccountComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackupAccountRoutingModule {
}
