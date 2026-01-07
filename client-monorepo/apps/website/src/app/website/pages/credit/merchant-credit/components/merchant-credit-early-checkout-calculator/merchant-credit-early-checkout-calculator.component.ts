import { Component, effect, input, signal } from '@angular/core';
import { Calculator } from '../../../../../../api/clients/models/templates/merchant-credit-v2/merchant-credit-template-data';
import { convertPersianDigitsToEnglish } from '../../../../../../utils/formaters';
import { CurrencyPipe } from '../../../../../../ui/ui-pipes/currency.pipe';
import { FormDirectivesModule } from '@digipay/ng-form-directives';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiButtonComponent } from '../../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { NgClass } from '@angular/common';
import { NgxSliderComponent } from '@digipay/ngx-slider';

@Component({
  selector: 'app-merchant-credit-early-checkout-calculator',
  templateUrl: './merchant-credit-early-checkout-calculator.component.html',
  styleUrls: ['./merchant-credit-early-checkout-calculator.component.scss'],
  standalone: true,
  imports: [UiButtonComponent, ReactiveFormsModule, FormDirectivesModule, FormsModule, NgClass, CurrencyPipe, NgxSliderComponent],
})
export class MerchantCreditEarlyCheckoutCalculatorComponent {
  calculator = input<Calculator | undefined>();
  providerActiveIndex = signal(0);
  totalWage = signal(0);
  totalProfit = signal(0);
  totalPayable = signal(0);
  totalDecrease = signal(0);
  sliderValue = signal(5);
  earlyDaysCount = signal(5);
  recipeAmount = signal(0);
  fundProviders = signal<any[]>([]);

  constructor() {
    effect(
      () => {
        const calc = this.calculator();
        if (calc?.providers?.length > 0) {
          this.recipeAmount.set(calc.defaultAmount ? +convertPersianDigitsToEnglish(calc.defaultAmount) : 1000000);
          this.fundProviders.set([...calc.providers]);
          this.calculate();
        } else {
          this.fundProviders.set([]);
          this.recipeAmount.set(0);
        }
      },
      { allowSignalWrites: true },
    );

    // Effect to trigger calculation on input changes
    effect(
      () => {
        // Track changes to providerActiveIndex, sliderValue, and recipeAmount
        this.providerActiveIndex();
        this.sliderValue();
        this.recipeAmount();
        this.calculate();
      },
      { allowSignalWrites: true },
    );
  }

  onChangeProvider(index: number) {
    this.providerActiveIndex.set(index);
  }

  onChangeAmount(input: string): void {
    let amount = '';
    if (input) {
      amount = convertPersianDigitsToEnglish(input);
      amount = amount.replace(/[^\d]/g, '');
    }
    this.recipeAmount.set(+amount);
  }

  changeCalculatorSlider(event: any) {
    this.sliderValue.set(event.default);
    this.earlyDaysCount.set(event.default);
  }

  calculate() {
    const amount = this.recipeAmount();
    const providers = this.fundProviders();
    const activeIndex = this.providerActiveIndex();
    let wage = 0;
    let profit = 0;

    if (!providers[activeIndex]) {
      this.totalWage.set(0);
      this.totalProfit.set(0);
      this.totalDecrease.set(0);
      this.totalPayable.set(0);
      return;
    }

    switch (providers[activeIndex].profitType) {
      case 'overall':
        wage = +convertPersianDigitsToEnglish(providers[activeIndex].wage);
        profit = +convertPersianDigitsToEnglish(providers[activeIndex].profit);
        this.totalWage.set(Math.round((this.earlyDaysCount() * (wage / 100) * amount) / 365));
        if (this.totalWage() < providers[activeIndex].minimumWage) {
          this.totalWage.set(+providers[activeIndex].minimumWage);
        }
        this.totalProfit.set(Math.round((this.earlyDaysCount() * (profit / 100) * amount) / 365));
        this.totalDecrease.set(Math.round(this.totalWage() + this.totalProfit()));
        this.totalPayable.set(Math.round(amount - this.totalDecrease()));
        break;

      case 'daily':
        wage = +convertPersianDigitsToEnglish(providers[activeIndex].wage);
        profit = +convertPersianDigitsToEnglish(providers[activeIndex].profit);
        this.totalWage.set(Math.round((this.earlyDaysCount() * wage * amount) / 365));
        if (this.totalWage() < providers[activeIndex].minimumWage) {
          this.totalWage.set(+providers[activeIndex].minimumWage);
        }
        this.totalProfit.set(Math.round(this.earlyDaysCount() * (profit / 100) * amount));
        this.totalDecrease.set(Math.round(this.totalWage() + this.totalProfit()));
        this.totalPayable.set(Math.round(amount - this.totalDecrease()));
        break;

      default:
        this.totalWage.set(0);
        this.totalProfit.set(0);
        this.totalDecrease.set(0);
        this.totalPayable.set(0);
        break;
    }

    if (this.totalPayable() < 0) {
      this.totalPayable.set(0);
    }
  }
}
