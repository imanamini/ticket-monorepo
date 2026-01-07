import { Component, input, signal } from '@angular/core';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import {
  UiLoadingSpinnerComponent
} from '../../../../../../../../components/ui-loading-spinner/ui-loading-spinner.component';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'insurance-premium-card',
  standalone: true,
  imports: [
    PipesModule,
    NgxBadgeModule,
    UiLoadingSpinnerComponent,
    NgTemplateOutlet
  ],
  templateUrl: './insurance-premium-card.component.html',
  styleUrl: './insurance-premium-card.component.scss'
})
export class InsurancePremiumCardComponent {
  loading = input<boolean>(false);
  wageAmount = input<number>(0);
  campaignDiscountAmount = input<number>(0);
  campaignWageAmount = input<number>(0);
}
