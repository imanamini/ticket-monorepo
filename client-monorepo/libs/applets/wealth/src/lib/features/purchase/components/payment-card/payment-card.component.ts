import { Component, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { PaymentCard } from '../../../../data-access/models/payment-card.model';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';

@Component({
  selector: 'app-payment-card',
  templateUrl: './payment-card.component.html',
  styleUrls: ['./payment-card.component.scss'],
  standalone: true,
  imports: [DecimalPipe, NgxDividerComponent],
})
export class PaymentCardComponent {
  data = input.required<PaymentCard>();
  protected readonly BorderColorsEnum = BorderColorsEnum;
}
