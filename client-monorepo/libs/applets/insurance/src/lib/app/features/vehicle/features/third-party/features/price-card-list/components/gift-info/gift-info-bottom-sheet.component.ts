import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';

import { IconEnum } from '../../../../../../../../data-access/enums/icon.enum';
import { InsIconComponent } from '../../../../../../components/ins-icon/ins-icon.component';
import { InsButtonComponent } from '../../../../../../../../components/ins-button/ins-button.component';
import { InsButtonSizeEnum } from '../../../../../../../../data-access/enums/ins-button-size.enum';
import {
  ProductCardGiftModel
} from '../../../../../../data-access/models/third-party/available-products/product-card-gift.model';

@Component({
  selector: 'gift-info',
  standalone: true,
  imports: [
    InsIconComponent,
    InsButtonComponent
  ],
  templateUrl: 'gift-info-bottom-sheet.component.html',
  styleUrl: 'gift-info-bottom-sheet.component.scss'
})
export class GiftInfoBottomSheetComponent {
  protected readonly IconEnum = IconEnum;

  protected readonly InsButtonSizeEnum = InsButtonSizeEnum;

  constructor(
    private bottomSheetRef: MatBottomSheetRef<GiftInfoBottomSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public giftData: { data: ProductCardGiftModel }) {
  }

  public onClose(): void {
    this.bottomSheetRef.dismiss();
  }
}
