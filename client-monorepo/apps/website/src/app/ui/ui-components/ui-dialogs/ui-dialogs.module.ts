import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { UiDialogSimpleComponent } from './ui-dialog-simple/ui-dialog-simple.component';
import { UiDialogContentPromotionComponent } from './ui-dialog-content-promotion/ui-dialog-content-promotion.component';
import { UiDialogTopBannerComponent } from './ui-dialog-top-banner/ui-dialog-top-banner.component';
import { UiDialogLoginComponent } from './ui-dialog-login/ui-dialog-login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { UiDialogOtpComponent } from './ui-dialog-otp/ui-dialog-otp.component';
import { UiDialogPaymentResultComponent } from './ui-dialog-payment-result/ui-dialog-payment-result.component';
import { UiDialogPinComponent } from './ui-dialog-pin/ui-dialog-pin.component';
import { UiDialogBaseComponent } from './ui-dialog-base/ui-dialog-base.component';
import { UiDialogDownloadCouponComponent } from './ui-dialog-download-coupon/ui-dialog-download-coupon.component';
import { UiDialogDownloadComponent } from './ui-dialog-download/ui-dialog-download.component';
import { LoginAppletModule } from '../../../website/applets/login-applet/login-applet.module';
import { UiBottomSheetsModule } from '../ui-bottom-sheets/ui-bottom-sheets.module';
import { UiDialogEditProfileComponent } from './ui-dialog-edit-profile/ui-dialog-edit-profile.component';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { UiDialogLogoutComponent } from './ui-dialog-logout/ui-dialog-logout.component';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { UiDialogThanksMsgComponent } from './ui-dialog-thanks-msg/ui-dialog-thanks-msg.component';
import { UiDialogCBnplDetailsComponent } from './ui-dialog-c-bnpl-details/ui-dialog-c-bnpl-details.component';
import { UiDialogCBnplVoucherComponent } from './ui-dialog-c-bnpl-voucher/ui-dialog-c-bnpl-voucher.component';
import { UiDialogSubscriptionDetailsComponent } from './ui-dialog-subscription-details/ui-dialog-subscription-details.component';
import { UiDialogWorkingCapitalComponent } from './ui-dialog-working-capital/ui-dialog-working-capital.component';

@NgModule({
  exports: [UiDialogSimpleComponent, UiDialogBaseComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    LoginAppletModule,
    UiBottomSheetsModule,
    NgOptimizedImage,
    UiFormFieldBuilderModule,
    ApiImageModule,
    UiDialogSimpleComponent,
    UiDialogContentPromotionComponent,
    UiDialogTopBannerComponent,
    UiDialogLoginComponent,
    UiDialogOtpComponent,
    UiDialogPaymentResultComponent,
    UiDialogPinComponent,
    UiDialogBaseComponent,
    UiDialogDownloadCouponComponent,
    UiDialogDownloadComponent,
    UiDialogEditProfileComponent,
    UiDialogLogoutComponent,
    UiDialogThanksMsgComponent,
    UiDialogCBnplDetailsComponent,
    UiDialogCBnplVoucherComponent,
    UiDialogSubscriptionDetailsComponent,
    UiDialogWorkingCapitalComponent,
  ],
})
export class UiDialogsModule {}
