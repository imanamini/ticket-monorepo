import { Component, Inject, OnInit, signal } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { FilterBottomSheetModel } from '../../data-access/models/filter-bottom-sheet.model';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { InsCheckboxComponent } from '../ins-checkbox/ins-checkbox.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InsButtonComponent } from '../../../../../../../../components/ins-button/ins-button.component';
import { InsIconComponent } from '../../../../../../components/ins-icon/ins-icon.component';
import { IconEnum } from '../../../../../../../../data-access/enums/icon.enum';
import {
  NotFoundInsuranceCompanyComponent
} from '../not-found-insurance-company/not-found-insurance-company.component';
import {
  InsuranceCompanyModel
} from '../../../../../../data-access/models/third-party/available-products/insurance-company.model';

@Component({
  selector: 'filter-bottom-sheet',
  standalone: true,
  imports: [
    InsButtonComponent,
    UiFormFieldBuilderModule,
    InsCheckboxComponent,
    ReactiveFormsModule,
    InsIconComponent,
    NotFoundInsuranceCompanyComponent
  ],
  templateUrl: './filter-bottom-sheet.component.html',
  styleUrl: './filter-bottom-sheet.component.scss'
})
export class FilterBottomSheetComponent implements OnInit {
  insuranceCompanies = signal<Partial<InsuranceCompanyModel>[]>([]);

  selectedCompaniesMap = signal<{ [key: number]: boolean }>({});

  searchMatchedCompanies = signal<Partial<InsuranceCompanyModel>[]>([]);

  searchForm: FormGroup;

  protected readonly IconEnum = IconEnum;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public bottomSheetData: FilterBottomSheetModel,
              public bottomSheetRef: MatBottomSheetRef<FilterBottomSheetComponent>,
  ) {
    this.insuranceCompanies.set(this.bottomSheetData.insuranceCompanies);
  }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      searchInput: new FormControl('', []),
    });

    this.initCompaniesList();

    this.searchForm.valueChanges.subscribe({
      next: changes => {
        this.filterCompanies(changes.searchInput);
      }
    });
  }

  initCompaniesList(): void {
    this.filterCompanies('');

    if (this.bottomSheetData.selectedInsuranceCompanies) {
      const tmp = {};
      this.bottomSheetData.selectedInsuranceCompanies.forEach(insuranceCompany => {
        tmp[insuranceCompany.id] = true;
      });
      this.selectedCompaniesMap.set(tmp);
    }
  }

  filterCompanies(inputName: string): void {
    this.searchMatchedCompanies.set(this.insuranceCompanies().filter((insuranceCompany) => {
      return insuranceCompany.name.includes(inputName);
    }));
  }

  insuranceCompanyClicked(insuranceCompanyID: number): void {
    this.selectedCompaniesMap()[insuranceCompanyID] = !this.selectedCompaniesMap()[insuranceCompanyID];
  }

  submitSelectedFilters(): void {
    this.bottomSheetRef.dismiss(this.insuranceCompanies().filter(insuranceCompany => this.selectedCompaniesMap()[insuranceCompany.id]));
  }
}
