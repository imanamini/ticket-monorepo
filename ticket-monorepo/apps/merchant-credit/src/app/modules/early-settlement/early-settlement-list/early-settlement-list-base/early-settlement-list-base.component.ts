import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SettlementFilter } from '../early-settlement-list.component';
import { SettlementStatus } from '../../../../api/clients/early-settlement/basic-models/settlement-status';
import { SettlementItem } from '../../../../api/clients/early-settlement/basic-models/settlement-item';

@Component({
  selector: 'app-early-settlement-list-base',
  templateUrl: './early-settlement-list-base.component.html',
  styleUrls: ['./early-settlement-list-base.component.scss']
})
export class EarlySettlementListBaseComponent implements OnInit {
  @Input()
  pageTitle: string = '';
  @Input()
  data: SettlementItem[] = [];
  @Input()
  filters: SettlementFilter = {};
  @Input()
  statusGroupList: { title: string, status: SettlementStatus[] }[] = [];
  @Input()
  selectedStatusGroupIndex: number = 0;
  @Input()
  loading: boolean = false;
  @Input()
  page: number = 1;
  @Input()
  totalPages: number = 10;
  @Input()
  totalItems: number = 100;
  @Input()
  perPage: number = 5;
  @Input()
  settlementStatusTranslated: { [key: number]: string } = {};
  @Input()
  settlementColor: { [key: number]: string } = {};
  @Output()
  selectStatusGroup = new EventEmitter<number>();
  @Output()
  pageChange = new EventEmitter();
  @Output()
  prevPage = new EventEmitter();
  @Output()
  nextPage = new EventEmitter();
  @Output()
  onDetailClick = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit(): void {
  }

}
