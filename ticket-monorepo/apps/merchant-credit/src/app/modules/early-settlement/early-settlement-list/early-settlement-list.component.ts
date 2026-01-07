import { Component, OnInit } from '@angular/core';
import { EarlySettlementApiService } from '../../../api/clients/early-settlement/early-settlement-api.service';
import { SearchRestriction } from '../../../api/clients/shared/basic-models/search-restriction';
import { SearchOrder } from '../../../api/clients/shared/basic-models/search-order';
import { SettlementStatus } from '../../../api/clients/early-settlement/basic-models/settlement-status';
import {  MatDialog } from '@angular/material/dialog';
import { SettlementItem } from '../../../api/clients/early-settlement/basic-models/settlement-item';
import {
  EarlySettlementDetailDialogComponent
} from '../early-settlement-detail-dialog/early-settlement-detail-dialog.component';

export interface SettlementFilter {
  status?: number | string;
}

@Component({
  selector: 'app-early-settlement-list',
  templateUrl: './early-settlement-list.component.html',
  styleUrls: ['./early-settlement-list.component.scss']
})
export class EarlySettlementListComponent implements OnInit {

  pageTitle = 'همه درخواست‌های من';
  filters: SettlementFilter = {};
  data: SettlementItem[] = [];
  gettingData: boolean = false;
  page: number = 0;
  perPage: number = 5;
  totalPages: number = 10;
  totalItems: number = 100;
  count: boolean = true;
  isLastPage: boolean = false;
  statusGroupList: { title: string, status: SettlementStatus[], color: string }[] = [
    {
      title: 'همه',
      status: [],
      color: ''
    },
    {
      title: 'در انتظار واریز تسهیلات',
      status: [
        SettlementStatus.PAID,
        SettlementStatus.KYC_VERIFIED,
        SettlementStatus.UPLOAD_IN_PROGRESS,
        SettlementStatus.UPLOADED,
        SettlementStatus.UPLOAD_FAILED
      ],
      color: '#FF811A'
    },
    {
      title: 'واریز موفق تسهیلات',
      status: [
        SettlementStatus.REPAID,
        SettlementStatus.INCONSISTENT,
        SettlementStatus.UNDER_PAID,
        SettlementStatus.ALLOCATED,
        SettlementStatus.REPAYMENT_FAILED
      ],
      color: '#00CC6D'
    },
    {
      title: 'تسویه موفق تسهیلات',
      status: [
        SettlementStatus.CONFIRMED,
      ],
      color: '#00CC6D'
    },
    {
      title: 'رد شده',
      status: [
        SettlementStatus.REJECTED,
        SettlementStatus.EXPIRED,
        SettlementStatus.CANCELED,
        SettlementStatus.ALLOCATION_FAILED,
        SettlementStatus.PROVIDER_VERIFICATION_REJECTED
      ],
      color: '#D82137'
    },
  ];
  settlementStatusTranslated: { [key: number]: string } = {};
  settlementColor: { [key: number]: string } = {};
  selectedStatusGroupIndex: number = 0;
  order?: SearchOrder;

  constructor(
    private earlySettlementApiService: EarlySettlementApiService,
    private dialog: MatDialog,
  ) {
    this.settlementStatusTranslated = {};
    this.settlementColor = {};
    this.statusGroupList.map(group => {
      group.status.map(statusKey => {
        this.settlementStatusTranslated[statusKey] = group.title;
        this.settlementColor[statusKey] = group.color;
      });
    });
  }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.gettingData = true;
    this.earlySettlementApiService.getList(this.page, this.perPage, this.count, this.getRestrictions(), this.getOrders()).subscribe(response => {
      this.data = response.settlements;

      this.totalPages = response.totalPages;
      this.totalItems = response.totalElements;
      this.isLastPage = response.settlements.length < this.perPage;
      this.gettingData = false;
    });
  }

  changeFilter(event: number) {
    this.selectedStatusGroupIndex = event;
    this.page = 0;
    this.getData();
  }

  private getRestrictions(): SearchRestriction[] {
    const registrations: SearchRestriction[] = [];
    if (this.statusGroupList[this.selectedStatusGroupIndex] && this.statusGroupList[this.selectedStatusGroupIndex].status.length) {
      registrations.push({
        field: 'statuses',
        type: 'collection',
        values: this.statusGroupList[this.selectedStatusGroupIndex].status
      });
    }
    return registrations;
  }

  private getOrders(): SearchOrder[] {
    if (this.order) {
      return [this.order];
    }
    return [];
  }

  openDetail(trackingCode: string): void {
    this.dialog.open(EarlySettlementDetailDialogComponent, {
      width: '400px',
      maxWidth: '90%',
      direction: 'rtl',
      closeOnNavigation: true,
      panelClass: ['no-border'],
      data: {
        trackingCode
      }
    });
  }

  onPageChange(pageNumber: number) {
    this.page = pageNumber;
    this.getData();

  }
}
