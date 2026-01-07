import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { EsLoanRepaymentApiService } from '../../../../api/clients/es-loan-repayment/es-loan-repayment-api.service';
import { StorageService } from '../../../../services/storage.service';

import { BorderColorsEnum } from '@digipay/ngx-divider';

import { SearchRestriction } from '../../../../api/clients/shared/basic-models/search-restriction';
import { SettlementValue } from '../../../../api/clients/es-loan-dashboard/es-loan-search-value';
import { RepaymentItemModel } from '../../../../api/clients/es-loan-repayment/models/repayment.item.model';
import { NgxBadgeStatus } from '@digipay/ngx-badge/lib/ngx-badge.type';

@Component({
  selector: 'es-loan-repayment-detail',
  templateUrl: './es-loan-repayment-detail.component.html',
  styleUrl: './es-loan-repayment-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EsLoanRepaymentDetailComponent implements OnInit {
  BorderColorsEnum = BorderColorsEnum;

  trackingCode = signal<string>('');
  fineAmount = signal<number>(0);
  settlement = signal<RepaymentItemModel>({} as RepaymentItemModel);
  showDetail = signal(false);
  isCopy = signal(false);
  creditId = signal<string>('');
  page = signal<number>(0);
  perPage = signal<number>(5);
  badgeStatus = signal<NgxBadgeStatus>('inactive');
  badgeSTitle = signal<string>('');

  storage = inject(StorageService);
  api = inject(EsLoanRepaymentApiService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  ngOnInit() {
    this.trackingCode.set(this.route.snapshot.paramMap.get('id') || '');
    this.getSettlementList(this.trackingCode());
  }

  backToRepaymentList() {
    this.router.navigate([`es-loan-repayment/list`]);
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

  getSettlementList(trackingCode: string) {
    this.api.getSettlementList(this.page(), this.perPage(), this.getRestrictions(), []).subscribe(response => {
      const settlement = response.settlements.find(item => item.trackingCode === trackingCode);

      if (settlement) {
        this.settlement.set(settlement);
        this.calculateFineAmount();

      }
    });
  }

  toggleDetail() {
    this.showDetail.set(!this.showDetail());
  }

  totalAmount(): number {
    const actualCredit = this.settlement()?.actualCreditAllocation ?? {};
    return (actualCredit.fundProviderFee || 0)
      + (actualCredit.digipayFee || 0)
      + (actualCredit.fundProviderInterest || 0);
  }

  bankAmount(): number {
    const actualCredit = this.settlement()?.actualCreditAllocation ?? {};
    return (actualCredit.fundProviderFee || 0)
      + (actualCredit.digipayFee || 0);
  }

  calculateFineAmount() {
    this.api.getRepaymentPenaltyAmount(this.trackingCode()).subscribe((res) => {
      if (res.repaymentPenaltyAmount) {
        this.fineAmount.set(res.repaymentPenaltyAmount);
      }
    });

    this.setBadgeStatus();
  }

  setBadgeStatus() {
    if (this.settlement().status == SettlementValue.CONFIRMED) {
      this.badgeStatus.set('success');
      this.badgeSTitle.set('تسویه شده');
    } else if (this.settlement().status == SettlementValue.ALLOCATED && this.settlement().repaymentRemainPeriod < 0) {
      this.badgeStatus.set('error');
      this.badgeSTitle.set('مشمول جریمه');
    } else if (this.settlement().status == SettlementValue.ALLOCATED && this.settlement().repaymentRemainPeriod > 0) {
      this.badgeStatus.set('warning');
      this.badgeSTitle.set('در انتظار تسویه');
    }

  }

  isConfirmedStatus(): boolean {
    return this.settlement().status == SettlementValue.CONFIRMED;
  }

  copyToClipboard() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(this.trackingCode()).then(() => {
        this.isCopy.set(true);
      });
    }
  }

  protected readonly Math = Math;
}
