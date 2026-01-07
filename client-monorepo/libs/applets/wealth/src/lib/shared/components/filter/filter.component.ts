import { IFilterItem } from './models';
import { Component, input, output } from '@angular/core';
import { FilterBadgeComponent } from './components/filter-badge/filter-badge.component';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  standalone: true,
  imports: [FilterBadgeComponent],
})
export class FilterComponent {
  filters = input<IFilterItem[]>([]);

  filterSelected = output<IFilterItem>();

  selectFilter(filter: IFilterItem) {
    this.filterSelected.emit(filter);
  }
}
