import { computed, inject, Injectable, signal } from '@angular/core';
import { BillTypeModel } from '../models/bill-type.model';
import { BILL_PAY_TYPE_INQUIRY_OR_ID, BILL_PAY_TYPES } from '../models/bill-pay-types.enum';
import { BillInfoResponse } from '../models/bill-info-response.model';
import { BillApiService } from './bill-api.service';
import { Router } from '@angular/router';
import { MessageService } from '@client-monorepo/common/utilities';
import { BillTypeEnum } from '@client-monorepo/daily-fintech/bill';

@Injectable({
  providedIn: 'root',
})
export class BillValidationService {
  private messageService = inject(MessageService);
  private billApiService = inject(BillApiService);
  private router = inject(Router);

  public isFastInquiry = signal(false);
  public billTypeModelState = signal<BillTypeModel | null>(null);
  public billTypeName = computed(() => {
    const billModel = this.billTypeModelState();
    if (!billModel) {
      return '';
    }
    return BillTypeEnum[billModel.type];
  });
  public billInfo = signal<BillInfoResponse | null>(null);

  /**
   * Gets method name strings based on the method numbers
   */
  getMethodNames(billTypeModel: BillTypeModel): string[] {
    if (!billTypeModel) {
      return [];
    }
    const billType: number = billTypeModel.type;
    const arrayOfMethodNumbers: Array<number> = billTypeModel.inquiryMethods;
    return arrayOfMethodNumbers
      .sort((a, b) => b - a)
      .filter((method) => method in BILL_PAY_TYPES)
      .map((method) => {
        const methodName = BILL_PAY_TYPES[method];

        if (methodName === 'INQUIRY_ID') {
          switch (billType) {
            case 11:
            case 12:
            case 13:
            case 6:
              return 'INQUIRY_ID';
            case 7:
              return BILL_PAY_TYPE_INQUIRY_OR_ID.TELEPHONE_INQUIRY;
            default:
              return BILL_PAY_TYPE_INQUIRY_OR_ID.INQUIRY_USING_BILL_ID;
          }
        }

        return methodName;
      });
  }

  setBillInfoData(billInfo: BillInfoResponse): void {
    this.billInfo.set(billInfo);
  }

  billValidationApiNavigateToConfirm(billId: string, payMethod: number, payId?: string, replaceUrl = false): Promise<any> {
    return new Promise((resolve, reject) => {
      const billTypeModel = this.billTypeModelState();
      if (!billTypeModel) {
        this.messageService.showErrorMessage('نوع قبض انتخاب نشده است.');
        return;
      }
      let param: object;
      if (payId) {
        param = {
          payId: payId,
          billId: billId,
          payMethod: payMethod,
        };
      } else {
        param = {
          inquiryId: billId,
          type: billTypeModel.type,
          payMethod: payMethod,
        };
      }

      this.billApiService.validateBill(param).subscribe({
        next: (result) => {
          this.setBillInfoData(result.billInfos[0]);
          this.router
            .navigate(['bill', 'confirm'], {
              replaceUrl: replaceUrl,
            })
            .then();
          resolve(true);
        },
        error: (error: any) => {
          this.messageService.showErrorOfErrorResponse(error);
          reject(error || new Error('Bill validation failed'));
        },
      });
    });
  }
}
