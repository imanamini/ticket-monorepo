import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-daily-payment',
  templateUrl: './daily-payment.component.html',
  styleUrls: ['./daily-payment.component.scss']
})
export class DailyPaymentComponent implements OnInit {

  @Input()
  detailRows: Array<{label: string, value: any}[]> = [];

  constructor() {
  }

  ngOnInit() {
  }

}
