import { Component, Input } from '@angular/core';
import { ValuePropositionSection } from '../offline-payment-template-data.response';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-offline-payment-value-propositions',
  templateUrl: './offline-payment-value-propositions.component.html',
  standalone: true,
  styleUrls: ['./offline-payment-value-propositions.component.scss'],
  imports: [NgIf, NgForOf],
})
export class OfflinePaymentValuePropositionsComponent {
  @Input() valuePropositionSection: ValuePropositionSection;
}
