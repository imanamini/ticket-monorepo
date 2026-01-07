import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Merchant } from '../../sandbox/models/merchants.model';
import { Router } from '@angular/router';
import { BorderColorsEnum } from '@digipay/ngx-divider';

@Component({
  selector: 'app-merchant-card',
  templateUrl: './merchant-card.component.html',
  styleUrls: ['./merchant-card.component.scss']
})
export class MerchantCardComponent implements OnInit {

  @Input() merchant!: Merchant;

  @Output() continuedJourney: EventEmitter<string> = new EventEmitter();

  BorderColorsEnum = BorderColorsEnum;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  continueJourney(creditId: string): void {
    this.continuedJourney.emit(creditId);
  }

  openButtonSheet() {
    this.router.navigateByUrl('/early-settlement/list');
  }

}
