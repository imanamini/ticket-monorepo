import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FundsSortType } from 'libs/applets/wealth/src/lib/components/core/models/fund-schemas';

@Component({
  selector: 'app-sort-bottom-sheet',
  standalone: true,
  imports: [MatRadioModule],
  templateUrl: './sort-bottom-sheet.component.html',
  styleUrl: './sort-bottom-sheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SortBottomSheetComponent {
  sortBy: FundsSortType;
  sorts: { title: string; value: FundsSortType }[] = [
    {
      title: 'پیش‌فرض',
      value: 'default',
    },
    {
      title: 'بیشترین سود',
      value: 'maxProfit',
    },
  ];

  private bottomSheet = inject(NgxBottomSheetService);

  constructor() {
    this.sortBy = this.bottomSheet.data().data;
  }

  onSortChanged(val: MatRadioChange) {
    this.sortBy = val.value;
    this.bottomSheet.outputData.set(val.value);
    this.bottomSheet.closeBottomSheet();
  }
}
