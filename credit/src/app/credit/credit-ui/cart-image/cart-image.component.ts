import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'credit-ui-cart-image',
  templateUrl: './cart-image.component.html',
  styleUrls: ['./cart-image.component.scss']
})
export class CartImageComponent implements OnInit {
  @Input() imageId: string;
  @Input() bgFront = '#ff2638';
  @Input() bgBack = '#cc0011';
  defaultLogo = 'assets/ui/default-cart-logo.svg';

  constructor() {
  }

  ngOnInit() {
  }

}
