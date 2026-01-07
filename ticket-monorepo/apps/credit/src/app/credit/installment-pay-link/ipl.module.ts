import { NgModule } from '@angular/core';
import { IplRoutingModule } from './ipl.routing.module';
import { CommonModule } from '@angular/common';
import { CardLayoutComponent } from '../module/bnpl/ui-components/card-layout/card-layout.component';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IplCalloutComponent } from './ipl-callout/ipl-callout.component';
import { IplLayoutComponent } from './ipl-layout/ipl-layout.component';
import { IplErrorService } from './ipl-errors/services/ipl-error.service';
import { UiPinInputComponent } from '../shared/components/ui-pin-input/ui-pin-input.component';
import { ProgressLoadingComponent } from '../shared/components/progress-loading/progress-loading.component';
import { IplService } from './services/ipl.service';
import { IplStepsComponent } from './ipl-steps/ipl-steps.component';
import { IplCellNumberComponent } from './ipl-steps/ipl-cell-number/ipl-cell-number.component';
import { IplOtpCodeComponent } from './ipl-steps/ipl-otp-code/ipl-otp-code.component';
import { IplDetailComponent } from './ipl-steps/ipl-detail/ipl-detail.component';
import { IplHeaderComponent } from './ipl-steps/ipl-header/ipl-header.component';
import { IplPinCodeComponent } from './ipl-steps/ipl-pin-code/ipl-pin-code.component';
import { MatError } from '@angular/material/form-field';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { LoginApiService } from '../api/login/login-api.service';
import { IplFundProviderComponent } from './ipl-fund-provider/ipl-fund-provider.component';
import { NgxLocationTrapModule } from '@digipay/ngx-location-trap';
import { FeaturePayService } from './services/feature-pay/feature-pay.service';
import { DpgPayService } from './services/dpg/dpg-pay/dpg-pay.service';
import { CardService } from './services/dpg/card/card.service';
import { PayClientService } from './services/dpg/pay-client/pay-client.service';
import { FeaturesService } from './services/dpg/features/features.service';
import { DpgPayComponent } from './ipl-dgp-pay/dpg-pay.component';
import { CardApiService } from './services/dpg/card/card-api.service';
import { CardNumberInputComponent } from './ipl-dgp-pay/components/card-number-input/card-number-input.component';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { UiSpinnerComponent } from './ipl-dgp-pay/components/ui-spinner/ui-spinner.component';
import { TextFieldComponent } from './ipl-dgp-pay/components/text-field/text-field.component';
import { FormDirectivesModule } from '@digipay/ng-form-directives';
import { DpgFormNoticeComponent } from './ipl-dgp-pay/components/form-notice/text-field-notice.component';
import {
  UiDynamicPassFieldComponent
} from './ipl-dgp-pay/components/ui-dynamic-pass-field/ui-dynamic-pass-field.component';
import { UiCountDownTextComponent } from './ipl-dgp-pay/components/ui-count-down-text/ui-count-down-text.component';
import { MobileDatePickerComponent } from './ipl-dgp-pay/components/mobile-date-picker/mobile-date-picker.component';
import { PageLoadingComponent } from './ipl-dgp-pay/components/page-loading/page-loading.component';
import { PageTitleBarComponent } from './ipl-dgp-pay/components/page-title-bar/page-title-bar.component';
import { UserService } from './services/dpg/user/user.service';
import { TokenService } from './services/token/token.service';
import { IplPayService } from './services/ipl-pay/ipl-pay.service';
import { GoogleAnalyticsDirective } from '../shared/directives/google-analytics.directive';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxIcon } from '@digipay/ngx-icon';
import {
  CreditInstallmentPaymentFooterComponent
} from './components/credit-installment-payment-footer/credit-installment-payment-footer.component';
import { IplDetailService } from './services/ipl-detail/ipl-detail.service';
import {
  IplDetailTotalDebtComponent
} from './ipl-steps/ipl-detail/ipl-detail-total-debt/ipl-detail-total-debt.component';
import {
  IplDetailAggregateComponent
} from './ipl-steps/ipl-detail/ipl-detail-aggregate/ipl-detail-aggregate.component';
import { MainLayoutComponent } from '../module/bnpl/ui-components/main-layout/main-layout.component';
import { DebtorInfoComponent } from './ipl-steps/ipl-detail/debtor-info/debtor-info.component';
import { NgxPin } from '@digipay/ngx-pin';

@NgModule({
  declarations: [
    IplStepsComponent,
    IplDetailComponent,
    IplCellNumberComponent,
    IplOtpCodeComponent,
    IplLayoutComponent,
    IplPinCodeComponent,
    DpgPayComponent,
    CardNumberInputComponent,
    UiSpinnerComponent,
    TextFieldComponent,
    DpgFormNoticeComponent,
    UiDynamicPassFieldComponent,
    UiCountDownTextComponent,
    MobileDatePickerComponent,
  ],
  imports: [
    IplRoutingModule,
    CommonModule,
    CardLayoutComponent,
    NgxBadgeModule,
    PipesModule,
    UiFormFieldBuilderModule,
    ReactiveFormsModule,
    FormsModule,
    IplCalloutComponent,
    UiPinInputComponent,
    ProgressLoadingComponent,
    MatError,
    MatProgressSpinner,
    IplFundProviderComponent,
    NgxLocationTrapModule,
    ApiImageModule,
    FormDirectivesModule,
    PageLoadingComponent,
    PageTitleBarComponent,
    GoogleAnalyticsDirective,
    NgxCalloutComponent,
    NgxButtonComponent,
    NgxIcon,
    IplHeaderComponent,
    CreditInstallmentPaymentFooterComponent,
    IplDetailTotalDebtComponent,
    IplDetailAggregateComponent,
    MainLayoutComponent,
    DebtorInfoComponent,
    NgxPin,
  ],
  providers: [
    IplErrorService,
    IplService,
    LoginApiService,
    FeaturePayService,
    DpgPayService,
    CardService,
    CardApiService,
    PayClientService,
    FeaturesService,
    UserService,
    TokenService,
    IplPayService,
    IplDetailService,
  ]
})
export class IplModule {

}
