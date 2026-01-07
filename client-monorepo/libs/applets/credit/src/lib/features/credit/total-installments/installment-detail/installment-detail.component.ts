import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import moment from 'jalali-moment';
import { InstallmentDetailDataModel } from './model/installment-detail-data.model';
import { getMonthTitle, isStartAndEndOfMonth } from '../../data-access/utils/date';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { ContractPurchasesDetailComponent } from '../contract-purchases-detail/contract-purchases-detail.component';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgxTooltipDirective } from '@digipay/ngx-tooltip';
import { CreditScrollableViewComponent } from '../../components/credit-scrollable-view/credit-scrollable-view.component';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { FeeDetailType } from '../../data-access/models/credit/installment/fee';

@Component({
  selector: 'app-installment-detail',
  templateUrl: './installment-detail.component.html',
  styleUrl: './installment-detail.component.scss',
  standalone: true,
  imports: [
    NgxBadgeModule,
    CreditScrollableViewComponent,
    NgxTooltipDirective,
    NgxIcon,
    ContractPurchasesDetailComponent,
    NgxButtonComponent,
    PipesModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstallmentDetailComponent {
  data = signal<InstallmentDetailDataModel | null>(null);
  scrollableHeight = signal<string>('unset');
  billingCycleDateTitle = computed<string>(() => {
    const billingCycleDate = this.data()?.installment.contract.billingCycleDate;
    const alongAMonth = isStartAndEndOfMonth(billingCycleDate?.startDate!, billingCycleDate?.endDate!);

    if (billingCycleDate) {
      if (alongAMonth) {
        return 'خریدهای ' + getMonthTitle(billingCycleDate.startDate);
      } else {
        return 'خریدهای ' + getMonthTitle(billingCycleDate.startDate, true) + ' تا ' + getMonthTitle(billingCycleDate.endDate, true);
      }
    } else {
      return '';
    }
  });
  installmentShortInfo = computed<string>(() => {
    const installment = this.data()?.installment;
    const orderTitle = installment?.contract.count === 1 ? 'تک قسطه' : 'قسط ' + installment?.order + ' از ' + installment?.contract.count;
    const duDate = moment(this.data()?.installment.dueDate).locale('fa').format('YYYY/MM/DD');
    return orderTitle + ' - ' + 'سررسید: ' + duDate;
  });
  feeHint = computed<string>((): any => {
    if (this.data()?.installment.fee) {
      const feeDetails = this.data()?.installment.contract.feeDetails;
      return feeDetails?.type === FeeDetailType.PERCENTAGE ? 'معادل ' + feeDetails?.value + ' % مبلغ قسط می‌باشد.' : '';
    }
    return null;
  });
  penaltyHint = computed<string>((): any => {
    if (this.data()?.installment.penalty) {
      const formattedPenalizeStartDate = moment(this.data()?.installment.penalizeStartDate).locale('fa').format('YYYY/MM/DD');
      return (
        'جریمه روزانه معادل ' +
        this.data()?.installment.contract.penaltyPercentagePerDay +
        '% مبلغ قسط از تاریخ ' +
        formattedPenalizeStartDate +
        ' محاسبه می‌شود.'
      );
    }
    return null;
  });
  private bottomSheet = inject(NgxBottomSheetService);
  constructor() {
    this.data.set(this.bottomSheet.data());
  }

  onDetailsOpened($event: boolean) {
    if ($event) {
      this.setMaxScrollableHeight();
    } else {
      this.setMinScrollableHeight();
    }
  }

  setMaxScrollableHeight() {
    const maximumAvailableHeight = 'calc(80vh - 246px)';
    this.scrollableHeight.set(maximumAvailableHeight);
  }

  setMinScrollableHeight() {
    const minimumHeight = '230px';
    this.scrollableHeight.set(minimumHeight);
  }

  close() {
    this.bottomSheet.closeBottomSheet();
  }
}
