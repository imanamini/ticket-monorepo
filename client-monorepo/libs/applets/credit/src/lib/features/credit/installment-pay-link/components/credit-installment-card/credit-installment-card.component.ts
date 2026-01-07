import { Component, computed, input, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDividerComponent } from '@digipay/ngx-divider';
import { NgxCheckboxComponent } from '@digipay/ngx-checkbox';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { ClickStopPropagationDirective } from '../../../data-access/directives/stop-propagation-directive';

@Component({
  selector: 'app-credit-installment-card',
  standalone: true,
  imports: [
    CommonModule,
    NgxDividerComponent,
    NgxCheckboxComponent,
    NgxBadgeModule,
    NgxButtonComponent,
    PipesModule,
    ClickStopPropagationDirective,
  ],
  templateUrl: './credit-installment-card.component.html',
  styleUrl: './credit-installment-card.component.scss',
})
export class CreditInstallmentCardComponent {
  showCheckBox = input<boolean>(true);
  checked = model<boolean>(false);
  title = input<string>();
  badge = input<'penalty' | 'penaltyWaiver' | 'settled'>();
  subtitle = input<string>();
  caption = input<string>();
  buttonText = input<string>();
  amount = input.required<number>();
  penaltyAmount = input.required<number>();
  penaltyWaiverAmount = input.required<number>();
  disabled = input<boolean>(false);

  waiverRemovesPenalty = computed<boolean>(
    () => this.penaltyAmount() > 0 && this.penaltyWaiverAmount() > 0 && this.penaltyAmount() === this.penaltyWaiverAmount(),
  );

  cta = output();

  onCta() {
    this.cta.emit();
  }

  onCardClick() {
    this.checked.update((prev) => !prev);
  }
}
