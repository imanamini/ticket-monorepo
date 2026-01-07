import { ChangeDetectionStrategy, Component, computed, inject, input, model, output } from '@angular/core';
import { ClickStopPropagationDirective } from '../../../data-access/directives/stop-propagation-directive';
import { NgxCheckboxComponent } from '@digipay/ngx-checkbox';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { CreditDigipayImageComponent } from '../../../components/credit-digipay-image/credit-digipay-image.component';
import { NgxIcon } from '@digipay/ngx-icon';
import { CircleIndicatorComponent } from '../circle-indicator/circle-indicator.component';
import { CREDIT_ENVIRONMENT } from '../../../credit-environment.interface';

@Component({
  selector: 'app-installment-overview-card',
  templateUrl: 'installment-overview-card.component.html',
  styleUrl: 'installment-overview-card.component.scss',
  standalone: true,
  imports: [
    ClickStopPropagationDirective,
    NgxCheckboxComponent,
    NgxDividerComponent,
    NgxBadgeModule,
    PipesModule,
    CreditDigipayImageComponent,
    NgxIcon,
    CircleIndicatorComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstallmentOverviewCardComponent {
  // Signals
  checked = model<boolean>(false);
  type = input<'Bnpl' | 'Credit'>('Bnpl');
  deActive = input(false);
  title = input<string>();
  subtitle = input<string>();
  amount = input.required<number>();
  penaltyAmount = input.required<number>();
  penaltyWaiverAmount = input.required<number>();
  installmentsCount = input<number>();
  order = input<number>();
  merchantBusinessIds = input<string[]>();
  fundProviderBusinessId = input<string>();

  waiverRemovesPenalty = computed<boolean>(
    () => this.penaltyAmount() > 0 && this.penaltyWaiverAmount() > 0 && this.penaltyAmount() === this.penaltyWaiverAmount(),
  );
  badge = computed<'penalty' | 'penaltyWaiver' | null>(() => {
    if (this.waiverRemovesPenalty()) {
      return 'penaltyWaiver';
    }
    if (this.penaltyAmount() > 0) {
      return 'penalty';
    }
    return null;
  });

  // Outputs
  merchantsClicked = output();
  deActiveClicked = output();

  // Variables
  protected readonly BorderColorsEnum = BorderColorsEnum;
  protected readonly isPillar = inject(CREDIT_ENVIRONMENT).creditEnv === 'pillar';

  onCardClick() {
    if (this.deActive()) {
      this.deActiveClicked.emit();
    } else {
      this.checked.update((prev) => !prev);
    }
  }

  merchantsClickedHandler($event: MouseEvent) {
    $event.stopPropagation();
    this.merchantsClicked.emit();
  }
}
