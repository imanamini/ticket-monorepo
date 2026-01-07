import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'credit-ui-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss']
})
export class CurrencyComponent implements OnInit {

  @Input()
  value: number;

  @Input()
  fontSize = '14px';

  constructor() { }

  ngOnInit() {
  }

}
