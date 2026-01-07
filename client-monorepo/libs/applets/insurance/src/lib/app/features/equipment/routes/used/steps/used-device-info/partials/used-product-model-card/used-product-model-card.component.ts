import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'used-product-model-card',
  templateUrl: './used-product-model-card.component.html',
  standalone: true,
  imports: [
    NgClass
  ],
  styleUrls: ['./used-product-model-card.component.scss']
})
export class UsedProductModelCardComponent implements OnInit {

  constructor() {
  }

  @Input()
  productModel: string;

  @Input()
  id: string;

  @Input()
  isActive: boolean;

  @Output()
  modelClicked = new EventEmitter<string>();

  ngOnInit(): void {
  }

  handleClick(): void {
    this.modelClicked.emit(this.id);
  }
}
