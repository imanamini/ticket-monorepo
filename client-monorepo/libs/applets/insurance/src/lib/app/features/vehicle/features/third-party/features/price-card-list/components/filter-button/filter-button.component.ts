import { Component, EventEmitter, input, OnInit, Output } from '@angular/core';
import { NgClass } from '@angular/common';
import { InsIconComponent } from '../../../../../../components/ins-icon/ins-icon.component';
import { IconEnum } from '../../../../../../../../data-access/enums/icon.enum';
import {
  InsuranceCompanyModel
} from '../../../../../../data-access/models/third-party/available-products/insurance-company.model';

@Component({
  selector: 'filter-button',
  standalone: true,
  imports: [
    NgClass,
    InsIconComponent
  ],
  templateUrl: './filter-button.component.html',
  styleUrl: './filter-button.component.scss'
})
export class FilterButtonComponent implements OnInit {

  selectedInsuranceCompanies = input<Partial<InsuranceCompanyModel>[]>([]);

  @Output() filterButtonClicked = new EventEmitter();

  @Output() deleteFiltersClicked = new EventEmitter();

  protected readonly IconEnum = IconEnum;

  constructor() {
  }

  ngOnInit(): void {
  }

  filterClicked(): void {
    this.filterButtonClicked.emit();
  }

  deleteSelectedFilters($event): void {
    $event.stopPropagation();
    this.deleteFiltersClicked.emit();
  }
}
