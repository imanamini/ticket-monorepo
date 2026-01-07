import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterOptions, SELECT_FILTER_TRANSLATOR } from '../../filters/filters';
import { NgFor, NgIf } from '@angular/common';
import { UiIconDirective } from '../../../../../../../ui/ui-directive/ui-icon.directive';

@Component({
  selector: 'app-filter-chips-box',
  templateUrl: './filter-chips-box.component.html',
  styleUrls: ['./filter-chips-box.component.scss'],
  standalone: true,
  imports: [UiIconDirective, NgFor, NgIf],
})
export class FilterChipsBoxComponent {
  @Input() selectedFilters: FilterOptions;

  @Input() brandTitleMap: { [key: string]: string };

  @Output() filtersChange = new EventEmitter();

  @Output() deleteAll = new EventEmitter();

  protected readonly SELECT_FILTER_TRANSLATOR = SELECT_FILTER_TRANSLATOR;

  protected readonly Object = Object;

  deleteFilter(filterType: string, filterOption: string) {
    for (const option of this.selectedFilters[filterType]) {
      if (filterOption === option) {
        this.selectedFilters[filterType] = this.selectedFilters[filterType].filter((item) => item !== filterOption);
        this.selectedFilters = { ...this.selectedFilters };
      }
    }

    this.filtersChange.emit(this.selectedFilters);
  }

  deleteAllFilters() {
    this.deleteAll.emit();
  }
}
