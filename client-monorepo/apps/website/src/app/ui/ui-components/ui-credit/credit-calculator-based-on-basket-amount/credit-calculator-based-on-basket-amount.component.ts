import { Component, Input, OnInit } from '@angular/core';
import { DigipayCreditApiService } from '../../../../api/digipay/digipay-credit-api.service';
import { InstallmentSaleCalculatorItem } from '../../../../api/digipay/models/credit/installmentSaleCalculatorResponse';
import { StyledSwitchOption } from '../../../models/switch-option.model';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { UiButtonComponent } from '../../ui-button/ui-button/ui-button.component';
import { UiLoadingDotsComponent } from '../../ui-loading-dots/ui-loading-dots.component';
import { UiAnimatedSwitchRoundedComponent } from '../../ui-switch/ui-animated-switch-rounded/ui-animated-switch-rounded.component';
import { NgIf } from '@angular/common';
import { delay, of } from 'rxjs';
import { NgxSliderComponent } from '@digipay/ngx-slider';

@Component({
  selector: 'app-credit-calculator-based-on-basket-amount',
  templateUrl: './credit-calculator-based-on-basket-amount.component.html',
  styleUrls: ['./credit-calculator-based-on-basket-amount.component.scss'],
  standalone: true,
  imports: [NgIf, UiAnimatedSwitchRoundedComponent, UiLoadingDotsComponent, UiButtonComponent, PipesModule, NgxSliderComponent],
})
export class CreditCalculatorBasedOnBasketAmountComponent implements OnInit {
  @Input() title: string;
  @Input() subtitle?: string;
  plans: InstallmentSaleCalculatorItem[];
  gettingData = false;
  sliderOptions: {
    creditAmount: number;
    basketRange: [number, number];
  }[] = [];
  sliderValue = 0;
  selectedPlan: InstallmentSaleCalculatorItem;
  installmentOptions: StyledSwitchOption[] = [];
  selectedInstallmentOptions: StyledSwitchOption;
  callApiTimer: any;

  constructor(private apiService: DigipayCreditApiService) {}

  ngOnInit(): void {
    this.generateSliderSteps();
  }

  generateSliderSteps(): void {
    const creditAmounts: number[] = [];
    for (let i = 400_000_000; i <= 2_000_000_000; i += 50_000_000) {
      creditAmounts.push(i);
    }
    creditAmounts.forEach((item, index) => {
      this.sliderOptions.push({
        creditAmount: item,
        basketRange: [item, creditAmounts[index + 1] ? creditAmounts[index + 1] - 1 : 0],
      });
    });
    this.sliderValue = Math.ceil(creditAmounts.length / 2);
    this.onChangeSelectedAmount();
  }

  onChangeSlider(event: any) {
    if (event.default) {
      this.sliderValue = event.default;
    }
    this.onChangeSelectedAmount();
  }

  onChangeSelectedAmount(): void {
    this.gettingData = true;
    if (this.callApiTimer) {
      clearTimeout(this.callApiTimer);
    }

    this.callApiTimer = of('')
      .pipe(delay(300))
      .subscribe({
        next: () => {
          this.apiService.calculateInstallmentSale(this.sliderOptions[this.sliderValue].creditAmount).subscribe({
            next: (res) => {
              this.plans = res.installmentOffers;
              this.installmentOptions = this.distinctFieldItems('monthCount', this.plans).map((item) => {
                const plan = this.plans.find((plan) => plan.monthCount === parseInt(<string>item));
                return {
                  label: `<b>${item} ماهه </b>` + `<span>در ${plan.installmentChequeCount} قسط</span>`,
                  value: item,
                };
              });
              this.selectedInstallmentOptions = this.installmentOptions[this.installmentOptions.length - 1];
              this.generateResult();
              this.gettingData = false;
            },
          });
        },
      });
  }

  onInstallmentChange($event: any): void {
    this.selectedInstallmentOptions = $event;
    this.generateResult();
  }

  generateResult(): void {
    this.selectedPlan = this.plans.find((item) => {
      return item.monthCount === +this.selectedInstallmentOptions.value;
    });
  }

  distinctFieldItems(fieldName: string, from: any[]): (string | number)[] {
    const options = {};
    from.forEach((item) => {
      options[item[fieldName]] = true;
    });
    return Object.keys(options);
  }
}
