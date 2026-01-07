import { Component, Input, OnInit } from '@angular/core';
import { DetailContentRow } from '../pay-details-information.component';

@Component({
  selector: 'app-pay-details-card',
  templateUrl: './pay-details-card.component.html',
  styleUrls: ['./pay-details-card.component.scss']
})
export class PayDetailsCardComponent implements OnInit {

  @Input() rows: DetailContentRow[];

  @Input() footerAmount: number;

  @Input() footerTitle: string;

  constructor() {
  }

  ngOnInit(): void {
  }

}
