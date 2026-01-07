import { Component, Input } from '@angular/core';
import { PaymentWays } from '../../../../api/clients/models/templates/car-fine/car-fine-template-data';
import { NgClass, NgFor, NgIf, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-driving-fine-payment-methods',
  templateUrl: './driving-fine-payment-methods.component.html',
  styleUrls: ['./driving-fine-payment-methods.component.scss'],
  standalone: true,
  imports: [NgFor, NgIf, NgOptimizedImage, NgClass],
})
export class DrivingFinePaymentMethodsComponent {
  @Input() paymentMethods: PaymentWays;
  isExpanded = false;

  toggleAccordion() {
    this.isExpanded = !this.isExpanded;
  }
}
