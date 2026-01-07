import { Component, Inject, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { SettlementStatus } from '../../../../../api/clients/early-settlement/basic-models/settlement-status';


export interface MobileFilterBottomSheetComponentData {
  statusGroupList: {title: string, status: SettlementStatus[]}[],
  selectedStatusGroupIndex: number;
}
@Component({
  selector: 'app-mobile-filter-bottom-sheet',
  templateUrl: './mobile-filter-bottom-sheet.component.html',
  styleUrls: ['./mobile-filter-bottom-sheet.component.scss']
})
export class MobileFilterBottomSheetComponent implements OnInit {

  selected: number;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: MobileFilterBottomSheetComponentData,
    private matBottomSheetRef: MatBottomSheetRef<MobileFilterBottomSheetComponent>,
  ) {
    this.selected = data.selectedStatusGroupIndex;
  }

  ngOnInit(): void {
  }

  close() {
    this.matBottomSheetRef.dismiss();
  }

  submitFilter() {
    this.matBottomSheetRef.dismiss({
      selectedStatusGroupIndex: this.selected
    });
  }
}
