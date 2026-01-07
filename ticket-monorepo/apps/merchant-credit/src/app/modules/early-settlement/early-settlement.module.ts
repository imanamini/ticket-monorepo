import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EarlySettlementComponent } from './early-settlement/early-settlement.component';
import { EarlySettlementRoutingModule } from './early-settlement-routing.module';
import { UserInterfaceModule } from '../../user-interface/user-interface.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EarlySettlementPreviewComponent } from './early-settlement-preview/early-settlement-preview.component';
import { EarlySettlementAmountsComponent } from './early-settlement-amounts/early-settlement-amounts.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  EarlySettlementPaymentConfirmComponent
} from './early-settlement-payment-confirm/early-settlement-payment-confirm.component';
import {
  EarlySettlementStatusPageComponent
} from './early-settlement-status-page/early-settlement-status-page.component';
import {
  EarlySettlementReviseAmountComponent
} from './early-settlement-revise-amount/early-settlement-revise-amount.component';
import { EarlySettlementListComponent } from './early-settlement-list/early-settlement-list.component';
import {
  EarlySettlementListDesktopComponent
} from './early-settlement-list/early-settlement-list-desktop/early-settlement-list-desktop.component';
import {
  EarlySettlementListMobileComponent
} from './early-settlement-list/early-settlement-list-mobile/early-settlement-list-mobile.component';
import {
  EarlySettlementListBaseComponent
} from './early-settlement-list/early-settlement-list-base/early-settlement-list-base.component';
import {
  MobileFilterBottomSheetComponent
} from './early-settlement-list/early-settlement-list-mobile/mobile-filter-bottom-sheet/mobile-filter-bottom-sheet.component';
import {
  EarlySettlementEmptyMessageComponent
} from './early-settlement-list/early-settlement-empty-message/early-settlement-empty-message.component';
import {
  EarlySettlementDetailDialogComponent
} from './early-settlement-detail-dialog/early-settlement-detail-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import {
  EarlySettlementProviderVerificationRejectedComponent
} from './early-settlement-provider-verification-rejected/early-settlement-provider-verification-rejected.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CoreModule } from '../../core/core.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {
  EarlySettlementConfirmationFeeDialogComponent
} from './early-settlement-confirmation-fee-dialog/early-settlement-confirmation-fee-dialog.component';
import { SmartDialog } from '../../user-interface/services/smart-dialog';
import {
  EarlySettlementSuccessResultComponent
} from './early-settlement-success-result/early-settlement-success-result.component';
import {
  EarlySettlementStepGetAmountComponent
} from './early-settlement-step-get-amount/early-settlement-step-get-amount.component';
import {
  EarlySettlementStepConfirmationDialogComponent
} from './early-settlement-step-confirmation-dialog/early-settlement-step-confirmation-dialog.component';
import {
  EarlySettlementStepPaymentComponent
} from './early-settlement-step-payment/early-settlement-step-payment.component';
import {
  EarlySettlementStepGetRuleComponent
} from './early-settlement-step-get-rule/early-settlement-step-get-rule.component';
import { RegistrationUiModule } from '../../sub-modules/registration-ui/registration-ui.module';
import {
  EarlySettlementRuleCardComponent
} from './components/early-settlement-rule-card/early-settlement-rule-card.component';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { FormDirectivesModule } from '@digipay/ng-form-directives';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { NgButtonModule } from '@digipay/ng-button';
import { EarlySettlementNoTicketComponent } from './early-settlement-no-ticket/early-settlement-no-ticket.component';
import { MatIcon } from '@angular/material/icon';

@NgModule({
  declarations: [
    EarlySettlementComponent,
    EarlySettlementPreviewComponent,
    EarlySettlementAmountsComponent,
    EarlySettlementPaymentConfirmComponent,
    EarlySettlementStatusPageComponent,
    EarlySettlementReviseAmountComponent,
    EarlySettlementListComponent,
    EarlySettlementListDesktopComponent,
    EarlySettlementListMobileComponent,
    EarlySettlementListBaseComponent,
    MobileFilterBottomSheetComponent,
    EarlySettlementEmptyMessageComponent,
    EarlySettlementDetailDialogComponent,
    EarlySettlementProviderVerificationRejectedComponent,
    EarlySettlementConfirmationFeeDialogComponent,
    EarlySettlementSuccessResultComponent,
    EarlySettlementStepGetAmountComponent,
    EarlySettlementStepConfirmationDialogComponent,
    EarlySettlementStepPaymentComponent,
    EarlySettlementStepGetRuleComponent,
    EarlySettlementRuleCardComponent,
    EarlySettlementNoTicketComponent
  ],
  imports: [
    CommonModule,
    EarlySettlementRoutingModule,
    UserInterfaceModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatCheckboxModule,
    CoreModule,
    MatSnackBarModule,
    RegistrationUiModule,
    ApiImageModule,
    FormDirectivesModule,
    NgxStatusResultModule,
    NgButtonModule,
    MatIcon
  ],
  providers: [
    SmartDialog
  ]
})
export class EarlySettlementModule {
}
