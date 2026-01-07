import { Component, Input, SimpleChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FILTER_TITLE_TRANSLATOR, MultipleCheckboxOptionsTypes, SELECT_FILTER_TRANSLATOR } from '../../filters/filters';
import { MerchantsFilterComponent } from '../merchants-filter.component';
import { NgFor, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-multiple-checkbox-filters',
  templateUrl: './multiple-checkbox-filters.component.html',
  styleUrls: ['./multiple-checkbox-filters.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, NgOptimizedImage],
})
export class MultipleCheckboxFiltersComponent extends MerchantsFilterComponent {
  @Input() filters: {
    filterOptions: MultipleCheckboxOptionsTypes;
  };

  protected readonly SELECT_FILTER_TRANSLATOR = SELECT_FILTER_TRANSLATOR;

  protected readonly FILTER_TITLE_TRANSLATOR = FILTER_TITLE_TRANSLATOR;

  protected readonly Object = Object;

  constructor(public fb: FormBuilder) {
    super(fb);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedFilters) {
      this.createForm();
    }
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group(this.createFilterObject());
    this.subscriptions[0] = this.form.valueChanges.subscribe((changes) => {
      const optionArray: Array<string> = [];
      for (const option of Object.keys(changes[this.title])) {
        if (changes[this.title][option]) {
          optionArray.push(option);
        }
      }
      this.changeFilterEmitter.emit({ [this.title]: optionArray });
    });
  }

  createFilterObject() {
    let filterOptionsObject = {};
    let isSelected: boolean;
    for (let i = 0; i < Object.keys(this.filters.filterOptions).length / 2; ++i) {
      isSelected = false;
      if (this.selectedFilters && this.selectedFilters[this.title]) {
        if (this.selectedFilters[this.title].includes(Object.keys(this.filters.filterOptions)[i])) {
          isSelected = true;
        }
      }
      filterOptionsObject = {
        ...filterOptionsObject,
        [Object.keys(this.filters.filterOptions)[i]]: [isSelected],
      };
    }
    return {
      [this.title]: this.fb.group(filterOptionsObject),
    };
  }
}
