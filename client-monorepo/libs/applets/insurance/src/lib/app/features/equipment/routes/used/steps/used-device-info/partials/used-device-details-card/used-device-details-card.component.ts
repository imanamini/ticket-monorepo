import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'used-device-details-card',
  templateUrl: './used-device-details-card.component.html',
  standalone: true,
  imports: [
    NgClass,
  ],
  styleUrls: ['./used-device-details-card.component.scss']
})
export class UsedDeviceDetailsCardComponent implements OnInit {

  constructor() {
  }

  @Input()
  title: string;

  @Input()
  model: string;

  @Input()
  buyDate: string;

  @Input()
  isActive: boolean;

  @Input()
  id: string;

  @Input()
  mode: 'SINGLE-DATA' | 'MULTI-DATA';

  @Output()
  clicked = new EventEmitter<string>();

  contentHeads: string[] = ['مدل', 'زمان خرید'];

  ngOnInit(): void {
  }

  chooseBodyText(index: number): string {
    switch (index) {
      case 0:
        return this.model;
      case 1:
        return this.buyDate;
    }
  }

  handleCardClick(): void {
    this.clicked.emit(this.id);
  }
}
