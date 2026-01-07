import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'amount-box',
  templateUrl: './amount-box.component.html',
  styleUrls: ['./amount-box.component.scss']
})
export class AmountBoxComponent implements OnInit {

  @Input()
  amount!: number;

  @Input()
  caption = '';

  constructor() { }

  ngOnInit(): void {
  }

}
