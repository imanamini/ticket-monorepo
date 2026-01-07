import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { BillMobileResponseModel } from '../../data-access/models/bill-mobile-response.model';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { BillInfoResponse } from '../../data-access/models/bill-info-response.model';

@Component({
  selector: 'bill-applet-type-picker',
  standalone: true,
  imports: [CommonModule, ApiImageModule, PipesModule, NgxButtonComponent],
  templateUrl: './bill-type-picker.component.html',
  styleUrl: './bill-type-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillTypePickerComponent {
  private bottomSheetService = inject(NgxBottomSheetService);

  sheetData = computed<{
    data: BillMobileResponseModel;
    number: string;
  }>(() => this.bottomSheetService.data());

  clickedBillItemType(billItem: BillInfoResponse) {
    this.bottomSheetService.outputData.set({
      billItem,
    });
    this.bottomSheetService.closeBottomSheet();
  }
}
