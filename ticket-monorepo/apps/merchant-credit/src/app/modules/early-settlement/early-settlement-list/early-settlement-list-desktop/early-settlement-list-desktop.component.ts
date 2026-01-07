import { Component, OnInit } from '@angular/core';
import { EarlySettlementListBaseComponent } from '../early-settlement-list-base/early-settlement-list-base.component';

@Component({
  selector: 'app-early-settlement-list-desktop',
  templateUrl: './early-settlement-list-desktop.component.html',
  styleUrls: ['./early-settlement-list-desktop.component.scss']
})
export class EarlySettlementListDesktopComponent extends EarlySettlementListBaseComponent implements OnInit {
  ngOnInit(): void {
  }

  onPageChange(pageNumber: number) {
    this.pageChange.emit(pageNumber);
  }
}
