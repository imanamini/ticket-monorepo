import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-request-price',
  templateUrl: './home-request-price.component.html',
  styleUrls: ['./home-request-price.component.scss']
})
export class HomeRequestPriceComponent implements OnInit {

  @Input() amount: number = 0;

  @Input() description: string = '';

  constructor() {
  }

  ngOnInit(): void {
  }

}
