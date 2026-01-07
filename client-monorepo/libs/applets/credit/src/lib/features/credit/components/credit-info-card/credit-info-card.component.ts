import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-credit-info-card',
  templateUrl: './credit-info-card.component.html',
  styleUrls: ['./credit-info-card.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditInfoCardComponent {
  title = input<string>();
}
