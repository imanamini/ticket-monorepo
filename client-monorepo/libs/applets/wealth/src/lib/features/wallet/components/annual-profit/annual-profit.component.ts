import { CommonModule } from '@angular/common';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { IAnnualProfit } from '../../models/annual-profit.interface';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';

@Component({
  selector: 'wealth-applet-annual-profit',
  standalone: true,
  imports: [CommonModule, NgxDividerComponent, PipesModule, NgxSkeletonLoadingComponent],
  templateUrl: './annual-profit.component.html',
  styleUrls: ['./annual-profit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnnualProfitComponent {
  detail = input.required<IAnnualProfit>();
  skeleton = input<boolean>();
  skeletonCount = input<number>();
  skeletonRowCount = input<number>();
  protected readonly BorderColorsEnum = BorderColorsEnum;
  protected readonly Math = Math;

  skeletonRowItems = computed(() => {
    return Array.from({ length: this.skeletonRowCount() }, (_, i) => i);
  });

  skeletonItems = computed(() => {
    return Array.from({ length: this.skeletonCount() }, (_, i) => i);
  });

  percentOfTotal(balance: number, monthlyPnls: Array<{ amount: number }>): number {
    if (!balance || balance <= 0) return 0;

    const yearTotal = monthlyPnls.reduce((sum, m) => sum + Math.max(m.amount, 0), 0);

    const value = (balance / yearTotal) * 100;
    return this.clamp(Math.round(value * 100) / 100, 0.5, 100);
  }

  private clamp(value: number, min = 0, max = 100): number {
    if (Number.isNaN(value)) return min;
    return Math.min(max, Math.max(min, value));
  }
}
