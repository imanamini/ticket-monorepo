import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';

import { BorderColorsEnum } from '@digipay/ngx-divider';

import { EsLoanRepaymentApiService } from '../../../../api/clients/es-loan-repayment/es-loan-repayment-api.service';
import { StorageService } from '../../../../services/storage.service';

import { SegmentItemsModel } from '@digipay/ngx-segmented-control/lib/models/types';
import { NgxBadgeMode, NgxBadgeStatus } from '@digipay/ngx-badge/lib/ngx-badge.type';

import { SearchRestriction } from '../../../../api/clients/shared/basic-models/search-restriction';
import { SettlementValue } from '../../../../api/clients/es-loan-dashboard/es-loan-search-value';
import { RepaymentItemModel } from '../../../../api/clients/es-loan-repayment/models/repayment.item.model';

enum Tabs {
  payed = 1,
  unPayed = 2
}

@Component({
  selector: 'es-loan-repayment-list',
  templateUrl: './es-loan-repayment-list.component.html',
  styleUrl: './es-loan-repayment-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EsLoanRepaymentListComponent implements OnInit {
  BorderColorsEnum = BorderColorsEnum;
  settlementValue = SettlementValue;
  tabs = Tabs;

  settlementList = signal<RepaymentItemModel[]>([]);
  creditId = signal<string>('');
  page = signal<number>(0);
  perPage = signal<number>(5);

  countStatus = signal<NgxBadgeMode>('fill');
  badgeStatus = signal<NgxBadgeStatus>('inactive');
  mode = signal<'PAGE_SEGMENT' | 'SECTION_SEGMENT'>('SECTION_SEGMENT');
  id = signal<number | string>(1);

  options = signal<SegmentItemsModel[]>([]);
  selectedOption = signal<SegmentItemsModel>({} as SegmentItemsModel);

  storage = inject(StorageService);
  api = inject(EsLoanRepaymentApiService);
  router = inject(Router);

  ngOnInit() {
    this.getSettlementList();
  }

  goToDashboard() {
    const ticket = this.storage.getTicket();
    this.router.navigate([`es-loan/${ticket}/home`]);
  }

  changeTab(event: any) {
    this.id.set(event.id);
  }

  getSettlementList() {
    this.api.getSettlementList(this.page(), this.perPage(), this.getRestrictions(), []).subscribe(response => {
      this.settlementList.set(response.settlements);
      const countByStatus = (status: number) => this.settlementList().filter(item => item.status === status).length;

      this.options.set([
        {
          text: 'در انتظار تسویه',
          id: 1,
          value: 1,
          count: countByStatus(SettlementValue.ALLOCATED),
          disable: countByStatus(SettlementValue.ALLOCATED) === 0,
          iconType: 'linear',
        },
        {
          text: 'تسویه شده',
          id: 2,
          value: 2,
          count: countByStatus(SettlementValue.CONFIRMED),
          disable: countByStatus(SettlementValue.CONFIRMED) === 0,
          iconType: 'linear',
        }
      ]);
      const defaultActiveTab = this.options().find(tab => !tab.disable);
      if (defaultActiveTab) {
        this.selectedOption.set(defaultActiveTab);
        this.id.set(defaultActiveTab.id);
      }
    });
  }

  private tabCount(status: number) {
    return this.settlementList().filter(item =>
      item.status === status).length;
  }

  private getRestrictions(): SearchRestriction[] {
    const registrations: SearchRestriction[] = [{
      'type': 'simple',
      'field': 'isInEsLoanJourney',
      'value': true,
      'operation': 'eq'
    },
      {
        field: 'statuses',
        type: 'collection',
        values: [
          SettlementValue.ALLOCATED,
          SettlementValue.CONFIRMED,
          SettlementValue.INCONSISTENT
        ]
      }];
    return registrations;
  }

  calculateBadgeData(date: number): string {
    setTimeout(() => {
      if (date >= 1) {
        this.badgeStatus.set('warning');
      } else {
        this.badgeStatus.set('error');
      }
    });

    return date >= 1 ? `${date} روز تا سررسید ` : 'مشمول جریمه';
  }

  goToRepaymentDetail(trackingCode: string) {
    this.router.navigate([`es-loan-repayment/detail/${trackingCode}`]);
  }
}
