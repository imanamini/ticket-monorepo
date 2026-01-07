import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'used-product-brand-card',
  templateUrl: './used-product-brand-card.component.html',
  standalone: true,
  imports: [
    NgClass,
  ],
  styleUrls: ['./used-product-brand-card.component.scss']
})
export class UsedProductBrandCardComponent implements OnInit {

  @Input()
  id: string;

  @Input()
  imageUrl: string;

  @Input()
  name: string;

  @Input()
  isActive: boolean;

  @Output()
  clicked = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit(): void {
  }

  handleClick(): void {
    this.clicked.emit(this.id);
  }

}
