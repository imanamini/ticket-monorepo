import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReceiptRoutingModule } from './receipt-routing.module';
import { ReceiptComponent } from './receipt.component';
import { UserInterfaceModule } from '../../../user-interface/user-interface.module';
import { WalletModule } from '../../wallet.module';
import { DirectDebitNavigationService } from '../services/direct-debit-navigation.service';
import { ContentComponent } from './components/content/content.component';
import { SuccessReceiptComponent } from './components/success-receipt/success-receipt.component';
import { ErrorReceiptComponent } from './components/error-receipt/error-receipt.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { StorageService } from '../../../core/services/storage.service';
import { WalletApiService } from '../../../api/wallet-api.service';
import { MessageService } from '../../../core/services/message.service';
import { RedirectService } from '../../../core/services/redirect.service';
import { HandleErrorService } from '../services/handle-error.service';

@NgModule({
  declarations: [
    ReceiptComponent,
    ContentComponent,
    SuccessReceiptComponent,
    ErrorReceiptComponent
  ],
  imports: [
    CommonModule,
    ReceiptRoutingModule,
    UserInterfaceModule,
    WalletModule
  ], providers: [
    MessageService,
    HandleErrorService
  ]
})
export class ReceiptModule {
}
