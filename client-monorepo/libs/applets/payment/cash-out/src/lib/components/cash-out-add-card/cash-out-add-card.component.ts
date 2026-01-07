import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ManageCardComponent } from '@client-monorepo/daily-fintech/bank-card';

@Component({
  selector: 'cash-out-applet-add-card',
  standalone: true,
  imports: [ManageCardComponent],
  templateUrl: './cash-out-add-card.component.html',
  styleUrl: './cash-out-add-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CashOutAddCardComponent {}
