import { Injectable } from '@angular/core';
import {
  CreditConfirmBottomSheetComponent,
  CreditConfirmBottomSheetData
} from '../../credit-ui/credit-confirm-bottom-sheet/credit-confirm-bottom-sheet.component';
import { Router } from '@angular/router';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

@Injectable({
  providedIn: 'root'
})
export class CancelService {

  constructor(
    private router: Router,
    private bottomSheet: MatBottomSheet,
  ) {
  }

  confirmBottomSheet() {
    return new Promise((resolve) => {
      this.bottomSheet.open<CreditConfirmBottomSheetComponent, CreditConfirmBottomSheetData>(CreditConfirmBottomSheetComponent, {
        panelClass: ['digipay-bottom-sheet'],
        data: {
          rejectButtonTitle: 'ادامه پرداخت',
          confirmButtonTitle: 'لغو پرداخت',
          description: 'درصورت خروج، پرداخت شما لغو می‌شود و می‌توانید روش پرداخت خود را تغییر دهید.'
        }
      }).afterDismissed().subscribe({
        next: result => {
          if (result) {
            this.router.navigate(['cancel']);
          } else {
            resolve('abort');
          }
        }
      });
    });

  }
}
