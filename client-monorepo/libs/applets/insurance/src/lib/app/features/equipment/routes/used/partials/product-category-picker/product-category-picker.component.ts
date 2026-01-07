import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgClass, NgForOf } from '@angular/common';

import { ProductCategoryModel } from '../../../../api/models/policy/product-category.model';

@Component({
  selector: 'product-category-picker',
  templateUrl: './product-category-picker.component.html',
  standalone: true,
  imports: [NgClass, NgForOf],
  styleUrls: ['./product-category-picker.component.scss'],
})
export class ProductCategoryPickerComponent implements OnInit {
  constructor() {}

  // Inputs
  @Input()
  selectedCategory: ProductCategoryModel;

  // Outputs
  @Output()
  categorySelected = new EventEmitter<ProductCategoryModel>();

  // Vars
  categoriesSet: CategoryPickerModel[] = [
    {
      name: 'گوشی موبایل',
      categoryType: ProductCategoryModel.MOBILE,
      image: 'insurance-assets/images/used-device/mobile.svg',
      activeImage: 'insurance-assets/images/used-device/mobile-active.svg',
    },
    {
      name: 'تبلت و کتابخوان',
      categoryType: ProductCategoryModel.TABLET,
      image: 'insurance-assets/images/used-device/tablet.svg',
      activeImage: 'insurance-assets/images/used-device/tablet-active.svg',
    },
    {
      name: 'لپ تاپ',
      categoryType: ProductCategoryModel.LAPTOP,
      image: 'insurance-assets/images/used-device/laptop.svg',
      activeImage: 'insurance-assets/images/used-device/laptop-active.svg',
    },
    {
      name: 'کنسول بازی',
      categoryType: ProductCategoryModel.GAMECONSOLE,
      image: 'insurance-assets/images/used-device/game-console.svg',
      activeImage: 'insurance-assets/images/used-device/game-console-active.svg',
    },
  ];

  ngOnInit(): void {}

  handleItemClick(category: CategoryPickerModel): void {
    this.selectedCategory = category.categoryType;
    this.categorySelected.emit(category.categoryType);
  }

  isActive(category: CategoryPickerModel): boolean {
    return category.categoryType === this.selectedCategory;
  }
}

export interface CategoryPickerModel {
  name: string;
  categoryType: ProductCategoryModel;
  image: string;
  activeImage: string;
}
