import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { PerformanceTierService } from '@client-monorepo/common/utilities';

@Component({
  selector: 'common-stores-logo-with-rate',
  standalone: true,
  imports: [CommonModule, ApiImageModule, NgxBadgeModule],
  templateUrl: './logo-with-rate.component.html',
  styleUrl: './logo-with-rate.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoWithRateComponent {
  backgroundMode = input<'elevated' | 'back'>('elevated');
  logoImageId = input<string>('');
  score = input(0, {
    transform: (value: number | undefined) => (value ? Number(value?.toFixed(1)) : 0),
  });
  borderRadius = computed(() => (this.score() ? '100px 100px 45px 45px' : '24px'));
  bgClass = computed(() => (this.backgroundMode() === 'elevated' ? 'surface-elevated' : 'surface-back'));
  invertBgClass = computed(() => (this.backgroundMode() === 'elevated' ? 'surface-back' : 'surface-elevated'));
  performanceTierService = inject(PerformanceTierService);
  loadingEffect = computed(() => this.performanceTierService.tier() === 'high');
}
