import {Component, effect, Inject, input, output, PLATFORM_ID, signal} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CreditCalculatorV3Component } from '../../../../../../../../ui/ui-components/ui-credit/credit-calculator-v3/credit-calculator-v3.component';
import { UiButtonComponent } from '../../../../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import {isPlatformBrowser, NgClass} from '@angular/common';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-providers-calculator',
  templateUrl: './providers-calculator.component.html',
  styleUrls: ['./providers-calculator.component.scss'],
  standalone: true,
  imports: [UiButtonComponent, CreditCalculatorV3Component, NgClass, NgxIcon],
})
export class ProvidersCalculatorComponent {
  fundProvider = input<any>();
  selectedCollateral = output<string>();
  selectedAmountEmitter = output<number>();
  selectedInstallmentEmitter = output<number>();

  selectedAmount = signal<number | undefined>(undefined);
  selectedInstallment = signal<number | undefined>(undefined);
  certainPlan = signal(false);

  constructor(private route: ActivatedRoute , @Inject(PLATFORM_ID) private platformId: string) {
    // Effect to handle query params
    effect(() => {
      this.route.queryParams.subscribe((params) => {
        if (params.amount && params.installmentCount) {
          this.certainPlan.set(true);
        }
      });
    });
  }

  back() {
    if(isPlatformBrowser(this.platformId)) {
      window.location.href =`/credit/c-credit/?amount=${this.selectedAmount() || ''}&installmentCount=${this.selectedInstallment() || ''}&utm_source=website&fundProviderCode=${this.fundProvider()?.fundProviderCode || ''}`
    }
  }

  changeCollateral(collateral: string) {
    this.selectedCollateral.emit(collateral);
  }

  onSelectedAmountChange(selectedAmount: number) {
    this.selectedAmount.set(selectedAmount);
    this.selectedAmountEmitter.emit(selectedAmount);
  }

  onSelectedInstallmentChange(selectedInstallment: number) {
    this.selectedInstallment.set(selectedInstallment);
    this.selectedInstallmentEmitter.emit(selectedInstallment);
  }
}
