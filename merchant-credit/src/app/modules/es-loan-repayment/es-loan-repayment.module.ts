import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EsLoanRepaymentRoutingModule } from './es-loan-repayment-routing.module';

import { UserInterfaceModule } from '../../user-interface/user-interface.module';

import { NgxSegmentedControlComponent } from '@digipay/ngx-segmented-control';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { NgxDividerComponent } from '@digipay/ngx-divider';
import { NgxBadgeModule } from '@digipay/ngx-badge';

import { EsLoanRepaymentComponent } from './es-loan-repayment.component';
import { EsLoanRepaymentListComponent } from './pages/es-loan-repayment-list/es-loan-repayment-list.component';
import { EsLoanRepaymentDetailComponent } from './pages/es-loan-repayment-detail/es-loan-repayment-detail.component';

@NgModule({
  declarations: [EsLoanRepaymentComponent, EsLoanRepaymentListComponent, EsLoanRepaymentDetailComponent],
  imports: [
    CommonModule,
    EsLoanRepaymentRoutingModule,
    NgxSegmentedControlComponent,
    NgxDividerComponent,
    NgxBadgeModule,
    UserInterfaceModule,
    NgxCalloutComponent
  ]
})
export class EsLoanRepaymentModule {
}
