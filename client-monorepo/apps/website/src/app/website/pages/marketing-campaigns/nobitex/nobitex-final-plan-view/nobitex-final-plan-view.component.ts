import { Component, Input } from '@angular/core';
import { CurrencyPipe } from '../../../../../ui/ui-pipes/currency.pipe';

@Component({
  selector: 'app-nobitex-final-plan-view',
  templateUrl: './nobitex-final-plan-view.component.html',
  styleUrls: ['./nobitex-final-plan-view.component.scss'],
  standalone: true,
  imports: [CurrencyPipe],
})
export class NobitexFinalPlanViewComponent {
  @Input() crediAmount: number;
  @Input() installmentCount: number;
}
