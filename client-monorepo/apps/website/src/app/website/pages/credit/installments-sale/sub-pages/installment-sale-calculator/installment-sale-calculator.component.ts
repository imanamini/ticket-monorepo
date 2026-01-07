import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { InstallmentSaleReservationBottomSheetComponent } from '../../components/installment-sale-reservation-bottom-sheet/installment-sale-reservation-bottom-sheet.component';
import { DigipayCreditApiService } from '../../../../../../api/digipay/digipay-credit-api.service';
import { CreditFilterPlansBasedOnBasketAmountComponent } from '../../../../../../ui/ui-components/ui-credit/credit-filter-plans-based-on-basket-amount/credit-filter-plans-based-on-basket-amount.component';
import { BaseLayoutComponent } from '../../../../../layout/base-layout/base-layout.component';

export enum ReservationType {
  INSTALLMENT,
}

@Component({
  selector: 'app-installment-sale-calculator',
  templateUrl: './installment-sale-calculator.component.html',
  styleUrls: ['./installment-sale-calculator.component.scss'],
  standalone: true,
  imports: [BaseLayoutComponent, CreditFilterPlansBasedOnBasketAmountComponent],
})
export class InstallmentSaleCalculatorComponent implements OnInit {
  amount: number;
  orderId: string;
  merchant: string = 'digikala';

  constructor(
    private route: ActivatedRoute,
    private bottomSheet: MatBottomSheet,
    private creditApiService: DigipayCreditApiService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params.amount) {
        this.amount = +this.cleanQueryParameter(params.amount);
      }
      if (params.orderId) {
        this.orderId = this.cleanQueryParameter(params.orderId);
        this.showBottomSheet();
      }
      if (params.merchant) {
        this.merchant = this.cleanQueryParameter(params.merchant);
      }
    });
  }

  cleanQueryParameter(parameter: string): string {
    return decodeURIComponent(parameter).split('?')[0];
  }

  showBottomSheet() {
    this.creditApiService
      .getShortTermReservationHours(ReservationType.INSTALLMENT)
      .subscribe((response) => {
        this.bottomSheet.open(InstallmentSaleReservationBottomSheetComponent, {
          panelClass: ['digipay-bottom-sheet'],
          data: {
            hours: response.shortTimeInterval,
          },
        });
      });
  }
}
