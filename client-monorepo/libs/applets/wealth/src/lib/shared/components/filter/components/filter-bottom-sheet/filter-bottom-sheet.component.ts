import { IFilterItem } from '../../models';
import { Component, inject } from '@angular/core';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { FormsModule } from '@angular/forms';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxCheckboxComponent } from '@digipay/ngx-checkbox';

@Component({
  selector: 'app-filter-bottom-sheet',
  templateUrl: './filter-bottom-sheet.component.html',
  styleUrls: ['filter-bottom-sheet.component.scss'],
  standalone: true,
  imports: [NgxButtonComponent, FormsModule, NgxCheckboxComponent],
})
export class FilterBottomSheetComponent {
  parentData: { filters: IFilterItem[]; title: string };
  private bottomSheet = inject(NgxBottomSheetService);

  constructor() {
    this.parentData = this.bottomSheet.data();
  }

  close() {
    this.bottomSheet.outputData.set(null);
    this.bottomSheet.closeBottomSheet();
  }

  updateFilters() {
    const newFilters = [...this.parentData.filters.filter((item) => item.active)];
    this.bottomSheet.outputData.set(newFilters);
    this.bottomSheet.closeBottomSheet();
  }

  checkChange(event: any) {
    this.parentData.filters.find((filter) => filter.value === event.source.value).active = event.checked;
  }
}
