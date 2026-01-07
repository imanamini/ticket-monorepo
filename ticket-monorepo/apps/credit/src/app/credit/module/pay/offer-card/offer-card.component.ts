import { Component, Input, OnInit } from '@angular/core';
import { CreditOfferItem } from '../../../api/offer/offer-info-response.model';

@Component({
  selector: 'app-offer-card',
  templateUrl: './offer-card.component.html',
  styleUrls: ['./offer-card.component.scss']
})
export class OfferCardComponent implements OnInit {

  @Input()
  offer: CreditOfferItem;

  constructor() {
  }

  ngOnInit() {
  }

}
