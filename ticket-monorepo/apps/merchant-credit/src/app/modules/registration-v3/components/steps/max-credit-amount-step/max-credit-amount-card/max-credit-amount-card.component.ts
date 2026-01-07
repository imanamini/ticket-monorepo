import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MaxCreditAmountDetails } from '../../../../../../api/clients/registration/basic-models/step';
import { numberToString } from '../../../../../../utils/number-to-string';

@Component({
  selector: 'app-max-credit-amount-card',
  templateUrl: './max-credit-amount-card.component.html',
  styleUrls: ['./max-credit-amount-card.component.scss']
})
export class MaxCreditAmountCardComponent implements OnInit {
  @Input() selected = false;

  @Input() creditAmount!: MaxCreditAmountDetails;

  @Output() cardClicked = new EventEmitter<any>();

  details: { label: string, value: any }[] = [];
  maxCreditAmount: any;

  constructor() {
  }

  ngOnInit(): void {
    this.maxCreditAmount = numberToString(this.creditAmount?.maxCreditAmount);
  }

  onCardClick() {
    this.cardClicked.emit(this.creditAmount);
  }
}
