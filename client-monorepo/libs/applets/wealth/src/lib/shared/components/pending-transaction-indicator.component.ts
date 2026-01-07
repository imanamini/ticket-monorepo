import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'wealth-applet-pending-transaction-indicator',
  standalone: true,
  imports: [CommonModule, NgxBadgeModule, NgxIcon],
  templateUrl: './pending-transaction-indicator.component.html',
  styleUrl: './pending-transaction-indicator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PendingTransactionIndicatorComponent {
  count = input<number>();
  title = input.required<string>();

  pendingTransactions = output();
}
