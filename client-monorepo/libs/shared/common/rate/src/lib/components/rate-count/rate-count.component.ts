import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { DpIconComponent } from '@client-monorepo/common/icon';

@Component({
  selector: 'common-rate-count',
  standalone: true,
  imports: [CommonModule, NgxBadgeModule, DpIconComponent],
  templateUrl: './rate-count.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.d-none]': 'rateCount() < minimumCount()' },
})
export class RateCountComponent {
  rateAmount = input<number>(0);
  roundedRateAmount = computed(() => Math.round(this.rateAmount() * 10) / 10);
  rateCount = input<number>(0);
  minimumCount = input<number>(10);
  size = input<'lg' | 'md' | 'sm' | 'tiny' | 'btnBadge'>('md');
  showCount=input<boolean>(true);
}
