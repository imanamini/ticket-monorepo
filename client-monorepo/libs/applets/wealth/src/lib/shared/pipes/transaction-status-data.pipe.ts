import { Pipe, PipeTransform } from '@angular/core';
import { TransactionTypeEnum } from '../../data-access/enums/transaction-type.enum';
import { OrderStatus } from '../../data-access/enums/order-status';
import { NgxBadgeStatus } from '@digipay/ngx-badge/lib/ngx-badge.type';

@Pipe({
  name: 'transactionStatusData',
  standalone: true,
})
export class TransactionStatusDataPipe implements PipeTransform {
  transform(
    type: TransactionTypeEnum,
    status: OrderStatus,
    instrumentType: string,
  ): {
    text: string;
    status: NgxBadgeStatus;
  } {
    let result: { text: string; status: NgxBadgeStatus } = { text: 'null', status: 'success' };
    const depositSuccess =
      (type === TransactionTypeEnum.Overplus || type === TransactionTypeEnum.Profit) && status === OrderStatus.Approved;
    const approved = status === OrderStatus.Approved;
    if (depositSuccess || approved) {
      result = {
        text: depositSuccess ? 'واریز موفق' : ' تایید شده',
        status: 'success',
      };
    } else if (status === OrderStatus.Draft || status === OrderStatus.Waiting) {
      result = {
        text: instrumentType === 'IPO' ? 'ثبت درخواست' : 'در انتظار تایید',
        status: 'warning',
      };
    } else if (status === OrderStatus.RejectedByManager || status === OrderStatus.Deleted || status === OrderStatus.RejectedBySystem) {
      result = {
        text: status === OrderStatus.RejectedByManager ? 'حذف مدیر' : status === OrderStatus.Deleted ? ' حذف شده' : 'رد سیستم',
        status: 'error',
      };
    }
    return result;
  }
}
