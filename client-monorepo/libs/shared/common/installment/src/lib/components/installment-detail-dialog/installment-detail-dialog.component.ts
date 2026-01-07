import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { SERVICE_TYPE } from '@client-monorepo/payment/transactions';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { InstallmentWidgetDataService } from '@client-monorepo/common/installment';
import moment from 'jalali-moment';
import { InstallmentDisplayData } from '../../data-access/models/installment-display-data';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'common-installment-installment-detail-dialog',
  standalone: true,
  imports: [CommonModule, PipesModule, NgxButtonComponent, NgxBadgeModule],
  templateUrl: './installment-detail-dialog.component.html',
  styleUrl: './installment-detail-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstallmentDetailDialogComponent {
  protected readonly SERVICE_TYPE = SERVICE_TYPE;

  private readonly bottomSheetService = inject(NgxBottomSheetService);
  private readonly installmentWidgetDataService = inject(InstallmentWidgetDataService);

  data = computed<InstallmentDisplayData>(() => this.bottomSheetService.data().data);

  modifiedItems = computed(() => {
    // 1st. Merge items with the same serviceType
    const mergedMap = this.data().items.reduce((acc: any, item: any) => {
      const serviceType = item.payload.serviceType;

      if (!acc[serviceType]) {
        acc[serviceType] = cloneDeep(item);
      } else {
        // sum amounts
        acc[serviceType].payload.contractDebts.totalAmount += item.payload.contractDebts.totalAmount;
        acc[serviceType].payload.contractDebts.penaltyAmount += item.payload.contractDebts.penaltyAmount;
      }

      return acc;
    }, {});

    const mergedItems = Object.values(mergedMap);

    // 2nd. Modify & sort based on the penalty value
    return mergedItems
      .map((item: any) => ({
        ...item,
        title: this.getTitleFromServiceType(item.payload.serviceType),
        badge: this.getBadge(item),
      }))
      .sort((a: any, b: any) => {
        const aHasPenalty = (a.payload.contractDebts?.penaltyAmount ?? 0) > 0;
        const bHasPenalty = (b.payload.contractDebts?.penaltyAmount ?? 0) > 0;
        return Number(bHasPenalty) - Number(aHasPenalty);
      });
  });

  getTitleFromServiceType(serviceType: SERVICE_TYPE): string {
    switch (serviceType) {
      case SERVICE_TYPE.BNPL:
        return 'بدهی اعتبار اقساطی';
      case SERVICE_TYPE.CREDIT:
        return 'بدهی اعتبار بانکی';
      default:
        return 'بدهی اعتبار اقساطی';
    }
  }

  getBadge(item: any) {
    if (item.payload?.contractDebts?.penaltyAmount ?? 0) {
      return {
        status: 'error',
        text: 'در حال جریمه',
      };
    }

    // Temporary solution: when user has more than 1 credit installment => no badge
    if (item.payload.serviceType === SERVICE_TYPE.CREDIT && this.data().creditCount > 1) {
      return null;
    }

    if (item.payload.isOverdue) {
      return {
        status: 'warning',
        text:
          item?.payload?.contractDebts?.daysToPenalized === 0
            ? 'آخرین روز بدون جریمه'
            : item?.payload?.contractDebts?.daysToPenalized + ' روز مانده تا جریمه',
      };
    }

    const date = this.installmentWidgetDataService.calculateDate([item]);
    return {
      status: 'neutral',
      text: date ? 'سررسید: ' + moment(Number(date), 'x').format('jYYYY/jMM/jDD') : 'سررسید: تسویه زودهنگام',
    };
  }

  paymentClick(item: any) {
    this.bottomSheetService.outputData.set(item);
    this.bottomSheetService.closeBottomSheet();
  }
}
