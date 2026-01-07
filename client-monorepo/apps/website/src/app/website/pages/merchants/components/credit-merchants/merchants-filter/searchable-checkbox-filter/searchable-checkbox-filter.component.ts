import { Component, Input, SimpleChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MerchantsFilterComponent } from '../merchants-filter.component';
import { BrandFilter, FILTER_TITLE_TRANSLATOR } from '../../filters/filters';
import { environment } from '../../../../../../../../environments/environment';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { NgIf, NgFor, NgOptimizedImage } from '@angular/common';
import { UiIconDirective } from '../../../../../../../ui/ui-directive/ui-icon.directive';

@Component({
  selector: 'app-searchable-checkbox-filter',
  templateUrl: './searchable-checkbox-filter.component.html',
  styleUrls: ['./searchable-checkbox-filter.component.scss'],
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, UiFormFieldBuilderModule, UiIconDirective, NgFor, NgOptimizedImage],
})
export class SearchableCheckboxFilterComponent extends MerchantsFilterComponent {
  @Input() filterOptions: Array<BrandFilter>;

  filteredOptions: Array<BrandFilter>;

  protected readonly FILTER_TITLE_TRANSLATOR = FILTER_TITLE_TRANSLATOR;

  protected readonly environment = environment;

  constructor(public fb: FormBuilder) {
    super(fb);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedFilters) {
      this.deleteSubscriptions();
      this.createForm();
    }
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    let formObject = {};
    let isSelected = false;
    for (const option of this.filterOptions) {
      isSelected = this.isOptionSelected(option);
      formObject = { ...formObject, [option.brandId]: [isSelected] };
    }

    this.filteredOptions = [...this.filterOptions];

    this.form = this.fb.group({
      brandSearch: [''],
      brandsList: this.fb.group(formObject),
    });

    this.subscriptions[0] = this.form.get('brandSearch').valueChanges.subscribe((brandSearchValue) => {
      if (brandSearchValue.toString().trim().length > 0) {
        this.filteredOptions = [...this.filterOptions.filter((option) => option.title.startsWith(brandSearchValue.toString().trim()))];
      } else {
        this.filteredOptions = [...this.filterOptions];
      }
    });

    this.subscriptions[1] = this.form.get('brandsList').valueChanges.subscribe((brandsListValue) => {
      const optionArray = [];
      for (const option in brandsListValue) {
        if (brandsListValue[option]) {
          optionArray.push(option);
        }
      }
      this.changeFilterEmitter.emit({ [this.title]: optionArray });
    });
  }

  isOptionSelected(option: BrandFilter): boolean {
    return this.selectedFilters && this.selectedFilters[this.title] && this.selectedFilters[this.title].includes(option.brandId);
  }
}
