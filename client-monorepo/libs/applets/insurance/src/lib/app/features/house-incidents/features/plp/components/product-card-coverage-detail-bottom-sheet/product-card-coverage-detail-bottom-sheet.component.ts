import { Component, inject, OnInit, signal } from '@angular/core';
import { BottomSheetService } from '../../../../../../data-access/services/bottom-sheet.service';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import {
  ProductCardCoverageDetailBottomSheetModel
} from '../../data-access/models/product-card-coverage-detail-bottom-sheet.model';
import { InsButtonComponent } from '../../../../../../components/ins-button/ins-button.component';
import { InsButtonStyleEnum } from '../../../../../../data-access/enums/ins-button-style.enum';
import { InsButtonSizeEnum } from '../../../../../../data-access/enums/ins-button-size.enum';

@Component({
  selector: 'product-card-coverage-detail-bottom-sheet',
  standalone: true,
  imports: [
    InsButtonComponent
  ],
  templateUrl: './product-card-coverage-detail-bottom-sheet.component.html',
  styleUrl: './product-card-coverage-detail-bottom-sheet.component.scss'
})
export class ProductCardCoverageDetailBottomSheetComponent implements OnInit {
  private bottomSheetService = inject(BottomSheetService);
  private bottomSheetData = inject(MAT_BOTTOM_SHEET_DATA);
  coverageDetail = signal<ProductCardCoverageDetailBottomSheetModel>(null);
  protected readonly InsButtonStyleEnum = InsButtonStyleEnum;
  protected readonly InsButtonSizeEnum = InsButtonSizeEnum;

  ngOnInit(): void {
    this.coverageDetail.set(this.bottomSheetData.data.coverageDetail);
  }

  close(): void {
    this.bottomSheetService.closeCurrentBottomSheet();
  }

}
