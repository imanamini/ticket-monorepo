import { Component, Input, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-products-list-skeleton',
  templateUrl: './products-list-skeleton.component.html',
  styleUrls: ['./products-list-skeleton.component.scss'],
  standalone: true,
  imports: [NgFor],
})
export class ProductsListSkeletonComponent implements OnInit {
  productSkeletonList = [];

  @Input()
  productSkeletonCount: number;

  ngOnInit(): void {
    this.productSkeletonList = new Array(this.productSkeletonCount);
  }
}
