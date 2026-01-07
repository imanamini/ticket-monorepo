import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { PipesModule } from '@digipay/ng-lib-pipes';

@Component({
  selector: 'common-installment-penalty-installment-card',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent, PipesModule],
  templateUrl: './penalty-installment-card.component.html',
  styleUrl: './penalty-installment-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PenaltyInstallmentCardComponent {
  amount = input.required<number>();
  itemCount = input.required<number>();
  penaltyCount = input.required<number>();
  paymentClick = output<void>();
  mode = input<'multi' | 'single'>('single');
  title = input<string>('قسط اعتبار');
  ctaText = computed<string>(() => (this.mode() === 'single' ? 'پرداخت' : 'مشاهده'));
  modifiedTitle = computed<string>(() => {
    if (this.mode() === 'single') {
      return this.title();
    } else {
      return `مجموع ${this.itemCount()} قسط`;
    }
  });
  subtitle = computed<string>(() => {
    if (this.mode() === 'single') {
      return 'درحال جریمه';
    } else {
      return `${this.penaltyCount()} قسط درحال جریمه`;
    }
  });
}
