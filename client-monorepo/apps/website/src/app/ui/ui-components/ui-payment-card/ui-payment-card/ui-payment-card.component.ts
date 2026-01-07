import { Component, Input } from '@angular/core';
import { CardData, UiPaymentInfoCardModule } from '@digipay/ng-ui-payment-info-card';

@Component({
  selector: 'app-ui-payment-card',
  templateUrl: './ui-payment-card.component.html',
  styleUrls: ['./ui-payment-card.component.scss'],
  standalone: true,
  imports: [UiPaymentInfoCardModule],
})
export class UiPaymentCardComponent {
  @Input()
  cardData: CardData;
}
