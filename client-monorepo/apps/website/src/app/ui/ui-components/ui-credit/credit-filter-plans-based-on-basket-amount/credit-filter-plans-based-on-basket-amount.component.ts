import { Component, Input, OnInit } from '@angular/core';
import { DigipayCreditApiService } from '../../../../api/digipay/digipay-credit-api.service';
import { InstallmentSaleCalculatorItem } from '../../../../api/digipay/models/credit/installmentSaleCalculatorResponse';
import { StyledSwitchOption } from '../../../models/switch-option.model';
import { CCreditStepsDialogComponent } from '../credit-steps-onboard-dialog/c-credit-steps-dialog.component';
import { DialogBottomSheetService } from '../../../../core/services/dialog-bottom-sheet.service';
import {
  PlanGroup,
  SERVICE_TYPE,
} from '../../../models/credit/credit-plan-group';
import { PRE_REGISTRATION_STEP_TYPE } from '../../../../api/clients/credit/pre-registration-step';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { UiAnimatedSwitchRoundedComponent } from '../../ui-switch/ui-animated-switch-rounded/ui-animated-switch-rounded.component';
import { CreditPageLoadingComponent } from '../credit-page-loading/credit-page-loading.component';
import { UiButtonComponent } from '../../ui-button/ui-button/ui-button.component';
import { NgClass, NgIf } from '@angular/common';
import { UiIconDirective } from '../../../ui-directive/ui-icon.directive';

@Component({
  selector: 'app-credit-filter-plans-based-on-basket-amount',
  templateUrl: './credit-filter-plans-based-on-basket-amount.component.html',
  styleUrls: ['./credit-filter-plans-based-on-basket-amount.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    UiIconDirective,
    UiButtonComponent,
    CreditPageLoadingComponent,
    UiAnimatedSwitchRoundedComponent,
    PipesModule,
  ],
})
export class CreditFilterPlansBasedOnBasketAmountComponent implements OnInit {
  @Input() title: string;
  @Input() basketAmount: number;
  @Input() orderId: string;
  @Input() merchant: string;
  plans: InstallmentSaleCalculatorItem[];
  selectedPlan: InstallmentSaleCalculatorItem;
  gettingData = false;
  installmentOptions: StyledSwitchOption[] = [];
  selectedInstallmentOptions: StyledSwitchOption;
  noPlan = true;

  constructor(
    private apiService: DigipayCreditApiService,
    private dialogService: DialogBottomSheetService,
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.gettingData = true;
    this.apiService.calculateInstallmentSale(this.basketAmount).subscribe({
      next: (res) => {
        this.noPlan = false;
        this.plans = res.installmentOffers;
        if (this.plans.length === 0) {
          this.noPlan = true;
          this.gettingData = false;
          return;
        }
        this.installmentOptions = this.distinctFieldItems(
          'monthCount',
          this.plans,
        ).map((item) => {
          const plan = this.plans.find(
            (plan) => plan.monthCount === parseInt(<string>item),
          );
          return {
            label:
              `<b>${item} ماهه </b>` +
              `<span>در ${plan.installmentChequeCount} قسط</span>`,
            value: item,
          };
        });
        this.selectedInstallmentOptions =
          this.installmentOptions[this.installmentOptions.length - 1];
        this.generateResult();
        this.gettingData = false;
      },
      error: () => {
        this.noPlan = true;
        this.gettingData = false;
      },
    });
  }

  generateResult(): void {
    this.selectedPlan = this.plans.find((item) => {
      return item.monthCount === +this.selectedInstallmentOptions.value;
    });
  }

  onInstallmentChange($event: any): void {
    this.selectedInstallmentOptions = $event;
    this.generateResult();
  }

  distinctFieldItems(fieldName: string, from: any[]): (string | number)[] {
    const options = {};
    from.forEach((item) => {
      options[item[fieldName]] = true;
    });
    return Object.keys(options);
  }

  openDialog() {
    const selectedPlanGroup: PlanGroup = {
      active: false,
      allocationPrepaymentAmount: this.selectedPlan.allocationPrepaymentAmount,
      collateralAmount: 0,
      collateralDto: {
        description: { body: '', header: '' },
        name: '',
        type: 'INSTALLMENT-CHEQUE',
      },
      creditAmount: this.selectedPlan.creditAmount,
      details: [],
      fundProvider: {
        active: false,
        color: '',
        fundProviderCode: 0,
        icon: '',
        name: '',
      },
      groupId: this.selectedPlan.groupId,
      hasAllocationPrepayment: false,
      installmentAmount: 0,
      installmentCount: 0,
      interestPercentage: 0,
      payableAmount: 0,
      planId: this.selectedPlan.planId,
      planRegistrationFlowDto: { description: {}, name: '', type: '' },
      serviceType: SERVICE_TYPE.BNPL,
    };
    const steps = [
      {
        type: PRE_REGISTRATION_STEP_TYPE.CONDITIONS,
        navTitle: 'دریافت و مصرف',
        title: `شرایط خرید با وام`,
        active: false,
        image: 'installment-cheque',
        info: {
          conditions: {
            title: selectedPlanGroup.collateralDto.description.header,
            description:
              '<p>توجه داشته باشید در هنگام ثبت خرید<b> مبلغ سبد خرید </b>شما بزرگتر از<b>مبلغ وام </b>باشد </p>' +
              '<br/>' +
              '<p> کالای انتخابی شما باید در<b>دسته بندی‌های خرید چکی دیجی‌کالا   </b> باشند.</p>',
          },
        },
      },
      {
        type: PRE_REGISTRATION_STEP_TYPE.CHEQUE,
        navTitle: 'چک اقساط',
        title: `شرایط چک‌های اقساط ( صیادی بنفش رنگ )`,
        active: false,
        image: 'purple-cheque',
        info: {
          conditions: {
            title: selectedPlanGroup.collateralDto.description.header,
            description:
              '<p>چک ضمانت باید <b>به نام خودتان </b> باشد.</p>' +
              '</br>' +
              '<p>تنها <b>چک صیادی بنفش رنگ </b> مطابق <b>نمونه </b> مورد قبول است.</p>' +
              '<br/>' +
              '<p>چک صیادی بنفش رنگ <b>تمامی بانک‌ها </b>  مورد قبول است.</p><br/>',
          },
        },
      },
      {
        type: PRE_REGISTRATION_STEP_TYPE.ADDITIONAL_INFO,
        navTitle: 'اطلاعات تکمیلی',
        title: '',
        active: false,
        info: {
          collateral: selectedPlanGroup.collateralDto,
        },
      },
    ];

    this.dialogService.open(CCreditStepsDialogComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      fullHeightBottomSheet: true,
      selectedPlanGroup,
      steps,
      utmMedium: 'installment-sale',
      orderId: this.orderId,
      merchant: this.merchant,
      amount: this.basketAmount,
    });
  }
}
