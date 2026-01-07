import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ui-bank-item',
  templateUrl: './ui-bank-item.component.html',
  styleUrls: ['./ui-bank-item.component.scss']
})
export class UiBankItemComponent {
  @Input()
  containerId: string;

  @Input()
  bankName: string;

  @Input()
  selected = false;

  @Input()
  imageId: string;

  @Input()
  dailyAmountMax: number;

  @Input()
  googleAnalyticId: {
    containerId: string
  };

  @Output()
  onClick: EventEmitter<any> = new EventEmitter<any>();
}
