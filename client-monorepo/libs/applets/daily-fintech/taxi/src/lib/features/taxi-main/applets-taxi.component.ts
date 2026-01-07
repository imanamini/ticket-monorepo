import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaxiInfoComponent } from '../../components/taxi-info/taxi-info.component';
import { PayTaxiModel, TaxiAmountDetails, TaxiApiError } from '../../data-access/models/pay-taxi.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { RecommendationAmountComponent } from '../../components/recommendation-amount/recommendation-amount.component';
import { PassengerCounterComponent } from '../../components/passenger-counter/passenger-counter.component';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { TaxiPayService } from '../../data-access/services/taxi-pay.service';
import { TaxiErrorPageComponent } from '../../components/taxi-error-page/taxi-error-page.component';
import { TaxiService } from '../../data-access/services/taxi.service';
import { TaxiConfirmDataModel } from '../../data-access/models/taxi-confirm-data.model';
import { TaxiMainSkeletonComponent } from '../../components/taxi-skeleton/taxi-main-skeleton/taxi-main-skeleton.component';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'taxi-applet-features',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    ReactiveFormsModule,
    TaxiInfoComponent,
    ApiImageModule,
    UiFormFieldBuilderModule,
    RecommendationAmountComponent,
    PassengerCounterComponent,
    PipesModule,
    TaxiErrorPageComponent,
    TaxiMainSkeletonComponent,
    NgxButtonComponent,
  ],
  templateUrl: './applets-taxi.component.html',
  styleUrl: './applets-taxi.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppletsTaxiComponent {
  minAmount!: number;
  maxAmount!: number;
  amounts: TaxiAmountDetails[] = [];
  taxiData!: PayTaxiModel;
  initiateAmount?: number;
  totalAmount?: number;
  isLoading = signal(true);
  isError = signal(false);
  taxiPayForm!: FormGroup;
  passengerNumber = 1;
  errorMessageMapper = {};
  apiErrorMessage!: TaxiApiError;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private activatedRoute: ActivatedRoute,
    private taxiPayService: TaxiPayService,
    private formBuilder: FormBuilder,
    private taxiService: TaxiService,
  ) {
    this.getTaxiData();
  }

  formValueChanges() {
    this.taxiPayForm.controls['amount'].valueChanges.subscribe((value: number) => {
      this.totalAmount = +value * this.passengerNumber;
    });
  }

  createForm() {
    this.errorMessageMapper = {
      min: `مبلغ کرایه باید بیشتر از ${this.taxiData.configs.minPaymentAmount} ریال باشد`,
      max: `مبلغ کرایه باید کمتر از ${this.taxiData.configs.maxPaymentAmount} ریال باشد`,
    };
    this.taxiPayForm = this.formBuilder.group({
      amount: [
        this.initiateAmount || '',
        [
          Validators.required,
          Validators.min(this.taxiData?.configs?.minPaymentAmount),
          Validators.max(this.taxiData?.configs?.maxPaymentAmount),
        ],
      ],
    });
    this.formValueChanges();
  }

  selectedNumberClicked(selectedItem: TaxiAmountDetails) {
    this.taxiPayForm.controls['amount'].setValue(selectedItem['amount']);
  }

  passengerNumberClicked(passengerNumber: number) {
    this.totalAmount = this.taxiPayForm.value.amount * passengerNumber;
    this.passengerNumber = passengerNumber;
  }

  getTaxiData() {
    const queryParams = this.activatedRoute.snapshot.queryParams;
    this.taxiPayService
      .getTaxiData(queryParams)
      .then((result) => {
        if (result?.status === 1) {
          this.isError.set(true);
          const errorMessage = {
            title: 'راننده در سامانه پرداخت هوشمند غیر‌فعال است.',
            description: 'متاسفانه در حال حاضر امکان پرداخت آنلاین برای این سفر امکان‌پذیر نمی‌باشد.',
            errorImageClass: 'deactivate-error-image',
          };
          this.apiErrorMessage = {
            title: errorMessage.title,
            description: errorMessage.description,
            errorImageClass: errorMessage.errorImageClass,
          };
          this.isLoading.set(false);
          return;
        }
        this.taxiData = result;
        this.maxAmount = result.configs.maxPaymentAmount;
        this.minAmount = result.configs.minPaymentAmount;

        if (result.amountDetails.length === 0) {
          this.amounts.push({ amount: this.minAmount, highlighted: false }, { amount: this.maxAmount, highlighted: false });
        } else {
          this.amounts.push(...result.amountDetails);
        }
        const highlightedAmount = result?.amountDetails.find((item) => item?.highlighted);
        this.initiateAmount = highlightedAmount?.amount;
        this.totalAmount = this.initiateAmount;
        this.createForm();
        this.isLoading.set(false);
      })
      .catch((error) => {
        this.isError.set(true);
        const errorMessage = {
          title: 'خدمات کرایه تاکسی در دسترس نیست.',
          description: error?.result?.message,
          errorImageClass: 'api-error-image',
        };
        this.apiErrorMessage = {
          title: errorMessage.title,
          description: errorMessage.description,
          errorImageClass: errorMessage.errorImageClass,
        };
        this.isLoading.set(false);
      });
  }

  navigateToConfirm() {
    if (this.totalAmount) {
      const confirmData: TaxiConfirmDataModel = {
        title: this.taxiData.title,
        amount: this.totalAmount,
        plate: this.taxiData.carInfo.plateDetail.title || '',
        color: this.taxiData.configs.paymentCard.colors,
        institutionId: this.route.snapshot.queryParams['institutionId'],
        terminalId: this.route.snapshot.queryParams['terminalId'],
        lineDescription: this.taxiData.driverInfo.lineDescription,
        passengersCount: this.passengerNumber,
        icon: this.taxiData.configs.paymentCard.icon,
        carTitle: this.taxiData.configs.paymentCard.carTitle,
      };
      this.taxiService.setTaxiConfirmData(confirmData);
      this.router.navigate(['taxi-pay', 'confirm']).then();
    }
  }
}
