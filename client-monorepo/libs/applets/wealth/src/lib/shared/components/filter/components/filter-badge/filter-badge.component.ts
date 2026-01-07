import { Component, input, output } from '@angular/core';
import { IFilterItem } from '../../models';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-filter-badge',
  templateUrl: './filter-badge.component.html',
  styleUrls: ['./filter-badge.component.scss'],
  standalone: true,
  imports: [NgxIcon, NgClass],
})
export class FilterBadgeComponent {
  filter = input<IFilterItem>(null);
  icon = input<string>('');

  filterSelected = output<IFilterItem>();

  selectFilter() {
    if (this.filter().id !== 'FILTER') {
      this.filter().active = !this.filter().active;
    }
    this.filterSelected.emit(this.filter());
  }
}
