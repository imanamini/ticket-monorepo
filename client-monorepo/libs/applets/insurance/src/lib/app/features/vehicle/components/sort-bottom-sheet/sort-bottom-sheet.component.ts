import { Component, Inject, signal } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { InsRadioButtonComponent } from '../ins-radio-button/ins-radio-button.component';
import {
  SORT_METHOD_TRANSLATIONS,
  SortMethod
} from '../../features/third-party/features/price-card-list/data-access/enums/SortMethod';
import { InsRadioButtonItemModel } from '../../data-access/models/ins-radio-button-item.model';
import { InsRadioButtonType } from '../../data-access/enums/ins-radio-button-type.enum';

@Component({
  selector: 'sort-bottom-sheet',
  standalone: true,
  imports: [
    InsRadioButtonComponent
  ],
  templateUrl: './sort-bottom-sheet.component.html',
  styleUrl: './sort-bottom-sheet.component.scss'
})
export class SortBottomSheetComponent {
  radioItems = signal<InsRadioButtonItemModel[]>([]);

  protected readonly InsRadioButtonType = InsRadioButtonType;
  selectedValue: SortMethod;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public bottomSheetData,
              public bottomSheetRef: MatBottomSheetRef<SortBottomSheetComponent>,
  ) {
    this.createRadioItems();
    this.selectedValue = this.bottomSheetData.data.selectedSortMethod;
  }

  createRadioItems(): void {
    for (const sortMethod of Object.keys(SortMethod).slice(0, Object.keys(SortMethod).length / 2)) {
      this.radioItems().push({
        title: SORT_METHOD_TRANSLATIONS[sortMethod],
        value: +sortMethod
      });
    }
  }

  sortItemSelected(): void {
    this.bottomSheetRef.dismiss(this.selectedValue);
  }
}
