import { Component, Inject, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { FilterOptions } from '../../filters/filters';
import { UiButtonComponent } from '../../../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { SearchableCheckboxFilterComponent } from '../searchable-checkbox-filter/searchable-checkbox-filter.component';
import { MultipleCheckboxFiltersComponent } from '../multiple-checkbox-filters/multiple-checkbox-filters.component';
import { FilterChipsBoxComponent } from '../filter-chips-box/filter-chips-box.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-ui-merchants-filter-dialog',
  templateUrl: './ui-merchants-filter-dialog.component.html',
  styleUrls: ['./ui-merchants-filter-dialog.component.scss'],
  standalone: true,
  imports: [NgIf, FilterChipsBoxComponent, MultipleCheckboxFiltersComponent, SearchableCheckboxFilterComponent, UiButtonComponent],
})
export class UiMerchantsFilterDialogComponent implements OnInit {
  data: any;

  selectedFilters: FilterOptions;

  protected readonly Object = Object;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public bottomSheetDialogData: any,
    private bottomSheetRef: MatBottomSheetRef,
  ) {
    this.selectedFilters = this.bottomSheetDialogData.selectedFilters;
    this.data = this.bottomSheetDialogData;
  }

  ngOnInit(): void {}

  filterChanged(filterChanges: FilterOptions) {
    this.selectedFilters = { ...this.selectedFilters, ...filterChanges };
  }

  deleteAllFilters() {
    this.selectedFilters = {};
  }

  submitFilters() {
    this.bottomSheetRef.dismiss(this.selectedFilters);
  }
}
