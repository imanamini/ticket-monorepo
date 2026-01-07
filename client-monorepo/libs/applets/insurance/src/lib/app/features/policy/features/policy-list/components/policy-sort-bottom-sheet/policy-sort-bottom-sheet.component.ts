import { Component, Inject, inject, OnInit, output, signal } from '@angular/core';
import { POLICY_SORT_ENUM_TRANSLATOR, PolicySortEnum } from '../../data-access/enums/policy-sort.enum';
import { NgxRadioButtonComponent } from '@digipay/ngx-radio-button';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'policy-sort-bottom-sheet',
  standalone: true,
  imports: [
    NgxRadioButtonComponent,
  ],
  templateUrl: './policy-sort-bottom-sheet.component.html',
  styleUrl: './policy-sort-bottom-sheet.component.scss'
})
export class PolicySortBottomSheetComponent implements OnInit {
  sortOptions = signal([
    {
      title: POLICY_SORT_ENUM_TRANSLATOR[PolicySortEnum.DESC],
      value: PolicySortEnum.DESC,
      isChecked: false
    },
    {
      title: POLICY_SORT_ENUM_TRANSLATOR[PolicySortEnum.ASC],
      value: PolicySortEnum.ASC,
      isChecked: false
    }
  ]);
  methodChange = output<PolicySortEnum>();
  public bottomSheetRef = inject(MatBottomSheetRef<PolicySortBottomSheetComponent>);

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public bottomSheetData: { data: { selectedSortMethod: PolicySortEnum } }) {
  }

  sortMethodChanged(index: number): void {
    this.sortOptions.update(prev => prev.map(((option, idx) => ({...option, isChecked: idx === index}))));
    this.bottomSheetRef.dismiss(this.sortOptions()[index]?.value);
  }

  ngOnInit(): void {
    this.sortOptions.update(prev => prev.map((option => ({
      ...option,
      isChecked: option.value === this.bottomSheetData.data.selectedSortMethod
    }))));
  }
}
