import { Component, Input, input, output, signal } from '@angular/core';
import { MaxCreditAmountDetails } from '../../../../../../../../../../api/clients/registration/basic-models/step';

@Component({
  selector: 'es-loan-saman-max-credit-card',
  templateUrl: './es-loan-saman-max-credit-card.component.html',
  styleUrl: './es-loan-saman-max-credit-card.component.scss'
})
export class EsLoanSamanMaxCreditCardComponent {

  @Input() selected: boolean = false;
  creditAmount = input<MaxCreditAmountDetails>({} as MaxCreditAmountDetails);
  details = signal<{ label: string, value: any }[]>([]);
  maxCreditAmount = signal<string>('');

  cardClicked = output<MaxCreditAmountDetails>();

  onCardClick() {
    this.cardClicked.emit(this.creditAmount());
  }
}
