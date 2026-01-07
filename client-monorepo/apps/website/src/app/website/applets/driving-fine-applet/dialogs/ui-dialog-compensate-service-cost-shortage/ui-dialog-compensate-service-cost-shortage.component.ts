import { Component, Inject, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CompensateServiceCostDialogData } from './model/CompensateServiceCostDialogData';
import { AbstractControl, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { CurrencyPipe } from '../../../../../ui/ui-pipes/currency.pipe';
import { PaymentService } from '../../../../../core/services/payment.service';
import { WalletApiService } from '../../../../../api/digipay/wallet-api.service';
import { MessageService } from '@client-monorepo/common/utilities';
import { ServicePromotion } from '../../../../../api/clients/models/templates/car-fine/car-fine-template-data';
import { DialogBottomSheetService } from '../../../../../core/services/dialog-bottom-sheet.service';
import { AutoServicePayment } from '../../services/auto-service-payment.service';
import { PaymentSelectFeatureResponse } from '../../../../../api/digipay/models/payment/payment-select-feature-response';
import {isPlatformBrowser, NgClass, NgFor, NgIf, NgOptimizedImage} from '@angular/common';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { UiButtonComponent } from '../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { UiIconDirective } from '../../../../../ui/ui-directive/ui-icon.directive';

@Component({
  selector: 'app-ui-dialog-compensate-service-cost-shortage',
  templateUrl: './ui-dialog-compensate-service-cost-shortage.component.html',
  styleUrls: ['./ui-dialog-compensate-service-cost-shortage.component.scss'],
  standalone: true,
  imports: [
    UiButtonComponent,
    UiIconDirective,
    ApiImageModule,
    ReactiveFormsModule,
    UiFormFieldBuilderModule,
    NgIf,
    NgClass,
    NgFor,
    NgOptimizedImage,
    CurrencyPipe,
  ],
})
export class UiDialogCompensateServiceCostShortageComponent implements OnInit {
  dialogData: CompensateServiceCostDialogData;

  form: UntypedFormGroup;

  isArbitraryCashIn = false;

  arbitraryCashInHint: string;

  arbitraryCashInLessThanRequiredError: string;

  arbitraryCashInMoreThanMaxError: string;

  isArbitraryCashSuitable = false;

  selectFeatureResponse: PaymentSelectFeatureResponse;

  minArbitraryCashInAmount: number;

  servicePromotions: Array<ServicePromotion>;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA)
    public bottomSheetData: { data: CompensateServiceCostDialogData },
    @Inject(MAT_DIALOG_DATA)
    public matDialogData: { data: CompensateServiceCostDialogData },
    private formBuilder: UntypedFormBuilder,
    private payment: PaymentService,
    private walletApi: WalletApiService,
    private messageService: MessageService,
    private dialogBottomSheetService: DialogBottomSheetService,
    private autoServicePayment: AutoServicePayment,
    @Inject('PLATFORM_ID') private platformId: Object,
  ) {
    this.dialogData = matDialogData && matDialogData.data ? matDialogData.data : bottomSheetData.data;
    this.selectFeatureResponse = this.dialogData.selectFeatureResponse;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      arbitraryToggle: [null, []],
      cashInAmount: [null, [this.cashInValidator.bind(this)]],
    });

    this.servicePromotions = this.dialogData.servicePromotions;

    this.form.valueChanges.subscribe((changes) => {
      this.isArbitraryCashIn = changes.arbitraryToggle;
      if (changes.cashInAmount) {
        const currencyPipe = new CurrencyPipe();
        this.arbitraryCashInHint = `مبلغ ورودی شما: ${currencyPipe.transform(changes.cashInAmount / 10)} تومان`;
        this.isArbitraryCashSuitable =
          changes.cashInAmount >= this.minArbitraryCashInAmount && changes.cashInAmount <= this.selectFeatureResponse.cashInXferMax;
      }
    });

    const currencyPipe = new CurrencyPipe();
    this.minArbitraryCashInAmount =
      this.selectFeatureResponse.amount > this.selectFeatureResponse.cashInXferMin
        ? this.selectFeatureResponse.amount
        : this.selectFeatureResponse.cashInXferMin;
    this.arbitraryCashInLessThanRequiredError = this.arbitraryCashInHint = `مبلغ ورودی باید حداقل ${currencyPipe.transform(
      this.minArbitraryCashInAmount,
    )} ریال باشد.`;
    this.arbitraryCashInMoreThanMaxError = `مبلغ ورودی باید حداکثر ${currencyPipe.transform(
      this.selectFeatureResponse.cashInXferMax,
    )} ریال باشد.`;
  }

  cashInValidator(control: AbstractControl) {
    if (!control.value) {
      return { lessThanRequired: false };
    }

    return {
      lessThanRequired: control.value < this.minArbitraryCashInAmount,
      moreThanMaximum: control.value > this.selectFeatureResponse.cashInXferMax,
    };
  }

  cashInButton() {
    let url = this.payment.generatePaymentUrl('services/car-fine');
    if (this.dialogData.serviceStep) {
      url += `?step=${this.dialogData.serviceStep}`;
      if (this.dialogData.fineTrackingCode) {
        url += `&fineTrackingCode=${this.dialogData.fineTrackingCode}`;
      }
    }

    let cashInAmount = this.selectFeatureResponse.amount;

    if (this.isArbitraryCashIn) {
      cashInAmount = this.form.value.cashInAmount;
    }

    if (cashInAmount < this.minArbitraryCashInAmount) {
      return;
    }
    if(isPlatformBrowser(this.platformId)){
      this.walletApi.createCashInPayment(cashInAmount, url).subscribe(
        (response) => {
          if (this.payment.payUsingTheNativeSdk(response)) {
            return;
          }
          this.autoServicePayment.setAutoPaymentTicket({
            step: this.dialogData.serviceStep,
            cashInStatus: 'pending',
          });
          window.location.href = response.payUrl + '?inbrowser=1';
        },
        (e) => {
          this.messageService.showErrorMessage(e.message);
        },
      );
    }
  }

  close() {
    this.dialogBottomSheetService.close();
  }
}
