import { Component, inject, input, signal } from '@angular/core';
import { Calculator, Provider } from '../../../../../../api/clients/models/templates/merchants-seller/merchants-seller-template-data';
import {
  CalculatorData,
  MerchantsSellerCalculatorData,
} from '../../../../../../ui/models/merchants-seller/merchants-seller-calculator-data';
import { Router } from '@angular/router';
import { NgxSliderComponent } from '@digipay/ngx-slider';
import { IranianRialsPipe } from '@client-monorepo/shared/common/iranian-rials';
import { NgxTooltipDirective } from '@digipay/ngx-tooltip';
import { NgClass } from '@angular/common';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NumberToStringPipe } from '../../../../../../ui/ui-pipes/number-to-string.pipe';

@Component({
  selector: 'app-merchants-seller-calculator-section',
  templateUrl: './merchants-seller-calculator-section.component.html',
  styleUrls: ['./merchants-seller-calculator-section.component.scss'],
  standalone: true,
  imports: [NgClass, NgxSliderComponent, IranianRialsPipe, NgxTooltipDirective, NgxButtonComponent, NumberToStringPipe],
})
export class MerchantsSellerCalculatorSectionComponent {
  calculator = input<Calculator | undefined>();
  finalAmount = signal(0);
  installmentActiveIndex = signal(0);
  providerActiveIndex = signal(0);
  provider = signal<Provider | undefined>(undefined);
  installments = signal<number[]>([12]);
  payableAmount = signal(0);
  amounts = signal<CalculatorData[]>(MerchantsSellerCalculatorData);

  private router = inject(Router);

  constructor() {
    const calc = this.calculator();
    if (calc?.providers?.length > 0 && !this.provider()) {
      this.provider.set(calc.providers[0]);
    }

    this.finalAmount();
    this.installmentActiveIndex();
    this.provider();
    this.calculate();
  }

  changeCalculatorSlider(event: any) {
    this.finalAmount.set(event.default);
  }

  onChangeInstallment(index: number) {
    this.installmentActiveIndex.set(index);
  }

  onChangeProvider(index: number, provider: Provider) {
    this.providerActiveIndex.set(index);
    this.provider.set(provider);
  }

  requestLoan() {
    this.router.navigateByUrl('working-capital/kyb');
  }

  calculate() {
    const provider = this.provider();
    if (!provider) return;

    const newAmounts = this.amounts().map((item, index) => {
      if (item.amount <= 2000000000 || index !== this.finalAmount()) {
        return item;
      }

      // Clone item to avoid mutating signal state directly
      const updatedItem = { ...item, installments: [...item.installments] };
      updatedItem.installments.forEach((installment) => {
        installment.serviceFee = (item.amount * 0.135 * installment.installmentCount) / 12;
        installment.installmentAmount = Math.round(
          (((item.amount * provider.profit) / 1200) * Math.pow(1 + provider.profit / 1200, installment.installmentCount)) /
            (Math.pow(1 + provider.profit / 1200, installment.installmentCount) - 1),
        );
      });
      return updatedItem;
    });

    this.amounts.set(newAmounts);
  }
}
