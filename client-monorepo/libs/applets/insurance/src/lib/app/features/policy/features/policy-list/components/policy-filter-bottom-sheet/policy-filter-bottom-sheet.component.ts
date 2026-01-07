import { Component, Inject, inject, signal } from '@angular/core';
import {
  InsuranceProductTypeEnum,
  InsuranceProductTypeLabelEnum
} from '../../../../../../data-access/enums/Insurance-product-type.enum';
import { InsButtonComponent } from '../../../../../../components/ins-button/ins-button.component';
import { InsButtonSizeEnum } from '../../../../../../data-access/enums/ins-button-size.enum';
import { InsButtonModeEnum } from '../../../../../../data-access/enums/ins-button-mode.enum';
import { InsButtonStyleEnum } from '../../../../../../data-access/enums/ins-button-style.enum';
import { NgxCheckboxComponent } from '@digipay/ngx-checkbox';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { PolicySortEnum } from '../../data-access/enums/policy-sort.enum';
import { PolicyFilterOptionModel } from '../../data-access/models/policy-filter-option.model';

@Component({
  selector: 'policy-filter-bottom-sheet',
  standalone: true,
  imports: [
    InsButtonComponent,
    NgxCheckboxComponent
  ],
  templateUrl: './policy-filter-bottom-sheet.component.html',
  styleUrl: './policy-filter-bottom-sheet.component.scss'
})
export class PolicyFilterBottomSheetComponent {
  filterOptions = signal<PolicyFilterOptionModel[]>([]);
  hasAnyFilterOptionChecked = signal<boolean>(false);
  protected readonly InsButtonSizeEnum = InsButtonSizeEnum;
  protected readonly InsButtonModeEnum = InsButtonModeEnum;
  protected readonly InsButtonStyleEnum = InsButtonStyleEnum;

  public bottomSheetRef = inject(MatBottomSheetRef<PolicyFilterBottomSheetComponent>);

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA)
    public bottomSheetData: {
    data: { filterOptions: PolicyFilterOptionModel[] }
  }) {
    if (this.bottomSheetData.data.filterOptions) {
      this.filterOptions.set(structuredClone(this.bottomSheetData.data.filterOptions));
      this.hasAnyFilterOptionChecked.set(!!this.filterOptions().find(option => option.isChecked));
    }
  }

  itemChecked(index: number): void {
    this.filterOptions()[index].isChecked = !this.filterOptions()[index].isChecked;
  }

  confirm(): void {
    this.bottomSheetRef.dismiss(this.filterOptions());
  }

  deleteFilters(): void {
    this.filterOptions.update(prevOptions => prevOptions.map(option => ({...option, isChecked: false})));
    this.confirm();
  }

  close(): void {
    this.bottomSheetRef.dismiss(null);
  }

}
