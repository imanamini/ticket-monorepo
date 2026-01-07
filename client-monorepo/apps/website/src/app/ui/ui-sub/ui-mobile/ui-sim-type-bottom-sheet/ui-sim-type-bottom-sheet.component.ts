import { Component, Inject } from '@angular/core';
import { UiOption } from '../../../models/ui-option';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { SimType } from '../../../../api/digipay/models/common/sim-type';
import { UiChoiceListComponent } from '../../../ui-components/ui-list/ui-choice-list/ui-choice-list.component';

@Component({
  selector: 'app-ui-sim-type-bottom-sheet',
  templateUrl: './ui-sim-type-bottom-sheet.component.html',
  styleUrls: ['./ui-sim-type-bottom-sheet.component.scss'],
  standalone: true,
  imports: [UiChoiceListComponent],
})
export class UiSimTypeBottomSheetComponent {
  options: UiOption[] = [
    { label: 'اعتباری', value: SimType.CREDIT },
    { label: 'دائمی', value: SimType.PERMANENT },
    { label: 'دیتا', value: SimType.DATA },
    { label: 'TD-LTE', value: SimType.TD_LTE },
  ];

  constructor(
    private matBottomSheet: MatBottomSheetRef<UiSimTypeBottomSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA)
    public data: {
      simTypes: UiOption[];
    },
  ) {
    if (data.simTypes) {
      this.options = [].concat(data.simTypes);
    }
  }

  onChoose(option: UiOption): void {
    this.matBottomSheet.dismiss(option);
  }
}
