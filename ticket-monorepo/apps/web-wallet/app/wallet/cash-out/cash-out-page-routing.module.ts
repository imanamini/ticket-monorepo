import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CashOutPageComponent } from './cash-out-page.component';
import { ChooseAmountComponent } from './components/choose-amount/choose-amount.component';
import { ChooseCardComponent } from './components/choose-card/choose-card.component';
import { AddNewCardComponent } from './components/add-new-card/add-new-card.component';
import {
  ConfirmationOfWithdrawalInformationComponent
} from './components/confirmation-of-withdrawal-information/confirmation-of-withdrawal-information.component';
import { AutoAddNewCardComponent } from './components/auto-add-new-card/auto-add-new-card.component';
import {ReceiptComponent} from "./components/receipt/receipt.component";

const routes: Routes = [
  {
    path: '',
    component: CashOutPageComponent,
    children: [
      {
        path: '',
        redirectTo: 'choose-amount',
        pathMatch: 'prefix'
      },
      {
        path: 'choose-amount',
        component: ChooseAmountComponent,
      },
      {
        path: 'choose-card',
        component: ChooseCardComponent,
      },
      {
        path: 'add-card',
        component: AddNewCardComponent,
      },
      {
        path: 'auto-add-card',
        component: AutoAddNewCardComponent,
      },
      {
        path: 'confirmation',
        component: ConfirmationOfWithdrawalInformationComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CashOutPageRoutingModule {
}
