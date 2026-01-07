import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { PipesModule } from '@digipay/ng-lib-pipes';

@Component({
  selector: 'common-installment-installment-info-card',
  standalone: true,
  imports: [CommonModule, NgxIcon, NgxButtonComponent, PipesModule],
  templateUrl: './installment-info-card.component.html',
  styleUrl: './installment-info-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstallmentInfoCardComponent {
  // Content control
  showDefault = input<boolean>(true); // Show default content by default

  // Optional inputs for default content
  title = input<string | undefined>('قسط اعتبار');
  subtitle = input<string>();
  amount = input<number>(0);

  // Required input for InstallmentInfoCardComponent compatibility
  itemCount = input<number>(0); // Made optional with default
  paymentClick = output<void>();

  mode = input<'multi' | 'single'>('single');
  ctaText = computed<string>(() => (this.mode() === 'single' ? 'پرداخت' : 'مشاهده'));
}
