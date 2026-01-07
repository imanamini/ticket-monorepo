import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EsLoanRoutingModule } from './es-loan-routing.module';
import { NgxIcon } from '@digipay/ngx-icon';
import { EsLoanComponent } from './es-loan.component';
import { SnackContainerComponent } from '@digipay/ngx-snackbar';
import { EsLoanDashboardComponent } from './pages/es-loan-dashboard/es-loan-dashboard.component';
import { EsLoanStepComponent } from '../../sub-modules/es-loan-ui/es-loan-step/es-loan-step.component';
import { MessageService } from '../../core/message.service';
import {
  EsLoanUnderConstructionComponent
} from './components/es-loan-under-construction/es-loan-under-construction.component';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { UserInterfaceModule } from '../../user-interface/user-interface.module';

@NgModule({
  declarations: [
    EsLoanComponent,
    EsLoanDashboardComponent,
    EsLoanUnderConstructionComponent],
  imports: [
    CommonModule,
    EsLoanRoutingModule,
    NgxIcon,
    SnackContainerComponent,
    EsLoanStepComponent,
    NgxStatusResultModule,
    NgxButtonComponent,
    UserInterfaceModule
  ],
  providers: [
    MessageService
  ]
})
export class EsLoanModule {
}
