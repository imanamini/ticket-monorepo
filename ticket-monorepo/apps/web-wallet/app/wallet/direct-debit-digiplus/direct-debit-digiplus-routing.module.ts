import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path: '', redirectTo: 'withdrawal-detail', pathMatch: 'full'},
  {
    path: 'backup-account/:ticket',
    loadChildren: () => import('./backup-account/backup-account.module').then(m => m.BackupAccountModule)
  },
  {
    path: 'withdrawal-detail/:ticket',
    loadChildren: () => import('./withdrawal-detail/withdrawal-detail.module').then(m => m.WithdrawalDetailModule)
  },
  {
    path: 'receipt',
    loadChildren: () => import('./receipt/receipt.module').then(m => m.ReceiptModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DirectDebitDigiplusRoutingModule {
}
