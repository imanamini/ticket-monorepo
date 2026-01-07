import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-early-settlement-amounts',
  templateUrl: './early-settlement-amounts.component.html',
  styleUrls: ['./early-settlement-amounts.component.scss']
})
export class EarlySettlementAmountsComponent implements OnInit {
  @Input() maxCreditAmount: number = 0;
  @Input() totalInvoiceAmount: number = 0;

  constructor() {
  }

  ngOnInit(): void {
  }

}
