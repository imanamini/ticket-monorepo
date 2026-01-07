import { Component, OnInit } from '@angular/core';
import { EarlySettlementListBaseComponent } from '../early-settlement-list-base/early-settlement-list-base.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import {
  MobileFilterBottomSheetComponent,
  MobileFilterBottomSheetComponentData
} from './mobile-filter-bottom-sheet/mobile-filter-bottom-sheet.component';

@Component({
  selector: 'app-early-settlement-list-mobile',
  templateUrl: './early-settlement-list-mobile.component.html',
  styleUrls: ['./early-settlement-list-mobile.component.scss']
})
export class EarlySettlementListMobileComponent extends EarlySettlementListBaseComponent implements OnInit {

  constructor(
    private bottomSheet: MatBottomSheet,
  ) {
    super();
  }

  ngOnInit(): void {
  }

  openFilterBox() {
    const data: MobileFilterBottomSheetComponentData = {
      selectedStatusGroupIndex: this.selectedStatusGroupIndex,
      statusGroupList: this.statusGroupList
    };
    this.bottomSheet.open(MobileFilterBottomSheetComponent, {
      panelClass: ['digipay-bottom-sheet', 'no-padding'],
      data
    }).afterDismissed().subscribe(result => {
      if (result && result.hasOwnProperty('selectedStatusGroupIndex')) {
        this.selectStatusGroup.emit(result.selectedStatusGroupIndex);
      }
    });
  }

  onPageChange(pageNumber: number) {
    this.pageChange.emit(pageNumber);
  }
}
