import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BnplPayFlowComponent } from './bnpl-pay-flow/bnpl-pay-flow.component';
import { BnplPayRoutingModule } from './bnpl-pay-routing.module';
import { BnplPayDetailsComponent } from './bnpl-pay-details/bnpl-pay-details.component';
import { CreditUiModule } from '../../credit-ui/credit-ui.module';
import { SharedModule } from '../../shared';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BnplPayConfirmComponent } from './bnpl-pay-confirm/bnpl-pay-confirm.component';
import { CreditRouteStateService } from '../../core/services/route-state/credit-route-state.service';
import { CountdownModule } from 'ngx-countdown';
import { CoreModule } from '../../core';
import { BnplPayFrictionComponent } from './bnpl-pay-friction/bnpl-pay-friction.component';
import { BnplPayHeaderComponent } from './bnpl-pay-header/bnpl-pay-header.component';
import { BnplPayCombinedCardComponent } from './bnpl-pay-combined-card/bnpl-pay-combined-card.component';
import { BnplPayCreditCardComponent } from './bnpl-pay-credit-card/bnpl-pay-credit-card.component';
import { BnplPayCashCardComponent } from './bnpl-pay-cash-card/bnpl-pay-cash-card.component';
import { BnplPayOneWithoutCashComponent } from './bnpl-pay-one-without-cash/bnpl-pay-one-without-cash.component';
import { BnplPayWithCashComponent } from './bnpl-pay-with-cash/bnpl-pay-with-cash.component';
import { BnplPayWithoutCashComponent } from './bnpl-pay-without-cash/bnpl-pay-without-cash.component';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { NgxDividerComponent } from '@digipay/ngx-divider';
import { CreditPaymentFooterComponent } from '../../credit-ui/credit-payment-footer/credit-payment-footer.component';

@NgModule({
  declarations: [
    BnplPayFlowComponent,
    BnplPayDetailsComponent,
    BnplPayConfirmComponent,
  ],
  imports: [
    CommonModule,
    CoreModule,
    BnplPayRoutingModule,
    CreditUiModule,
    SharedModule,
    MatTooltipModule,
    CountdownModule,
    BnplPayFrictionComponent,
    BnplPayHeaderComponent,
    BnplPayCombinedCardComponent,
    BnplPayCreditCardComponent,
    BnplPayCashCardComponent,
    BnplPayOneWithoutCashComponent,
    BnplPayWithCashComponent,
    BnplPayWithoutCashComponent,
    NgxButtonComponent,
    NgxAppBarComponent,
    NgxDividerComponent,
    CreditPaymentFooterComponent
  ],
  providers: [
    {
      provide: 'RouteStateInterface',
      useClass: CreditRouteStateService,
    }
  ]
})
export class BnplPayModule {
}
