import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { DrivingFineAppletComponent } from './driving-fine-applet/driving-fine-applet.component';
import { CarInfoEnteringComponent } from './driving-fine-applet/car-info-entering/car-info-entering.component';
import { InquiryCostPaymentComponent } from './driving-fine-applet/inquiry-cost-payment/inquiry-cost-payment.component';
import { FinePaymentComponent } from './driving-fine-applet/fine-payment/fine-payment.component';

import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { ReactiveFormsModule } from '@angular/forms';
import { UiVehicleService } from './services/ui-vehicle.service';
import { FineStateManagerService } from './services/fine-state-manager.service';
import { FineApiService } from './services/fine-api.service';
import { InquiryMethodSelectComponent } from './driving-fine-applet/inquiry-method-select/inquiry-method-select.component';

import { FineDataService } from './services/fine-data.service';

import { FinePaymentResultComponent } from './driving-fine-applet/fine-payment-result/fine-payment-result.component';
import { FinePaymentService } from './services/fine-payment.service';
import { UiDialogCompensateServiceCostShortageComponent } from './dialogs/ui-dialog-compensate-service-cost-shortage/ui-dialog-compensate-service-cost-shortage.component';
import { UiDialogPlateLetterSelectComponent } from './dialogs/ui-dialog-plate-letter-select/ui-dialog-plate-letter-select.component';
import { UiDialogFinePaymentCancellationComponent } from './dialogs/ui-dialog-fine-payment-cancelation/ui-dialog-fine-payment-cancellation.component';

import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { PlatesListComponent } from './driving-fine-applet/car-info-entering/plates-list/plates-list.component';
import { LastInquiryReportComponent } from './driving-fine-applet/car-info-entering/last-inquiry-report/last-inquiry-report.component';

import { RouterLink } from '@angular/router';

@NgModule({
  exports: [DrivingFineAppletComponent],
  providers: [UiVehicleService, FineStateManagerService, FineApiService, FineDataService, FinePaymentService],
  imports: [
    CommonModule,
    UiFormFieldBuilderModule,
    ReactiveFormsModule,
    NgOptimizedImage,
    ApiImageModule,
    RouterLink,
    DrivingFineAppletComponent,
    CarInfoEnteringComponent,
    InquiryCostPaymentComponent,
    FinePaymentComponent,
    InquiryMethodSelectComponent,
    FinePaymentResultComponent,
    UiDialogCompensateServiceCostShortageComponent,
    UiDialogPlateLetterSelectComponent,
    UiDialogFinePaymentCancellationComponent,
    PlatesListComponent,
    LastInquiryReportComponent,
  ],
})
export class DrivingFineAppletModule {}
