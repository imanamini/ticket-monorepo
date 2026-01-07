import { Component, computed, inject, signal } from '@angular/core';
import { BnplHelpData } from '../data/models/bnpl-help-data';
import {
  individual1PayBnplHelpData,
  individual4PayBnplHelpData,
  individual4PayHowUseSection,
  organizational1PayBnplHelpData,
  organizational4PayBnplHelpData,
  organizational4PayHowUseSection,
} from '../data/bnpl-help-data';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { BnplHelpSectionComponent } from '../bnpl-help-section/bnpl-help-section.component';
import { BnplHelpMenuComponent } from '../bnpl-help-menu/bnpl-help-menu.component';
import { CreditInstallmentFeeService } from '../../../../data-access/services/credit-installment-fee.service';
import { LandingElementAlertBox } from '../data/models/landing-element';
import { FeeDetails, FeeDetailType } from '../../../../data-access/models/credit/installment/fee';
import { currencyFormat } from '@digipay/strings';

@Component({
  selector: 'ui-bnpl-help',
  templateUrl: './bnpl-help.component.html',
  styleUrls: ['./bnpl-help.component.scss'],
  standalone: true,
  imports: [BnplHelpSectionComponent, BnplHelpMenuComponent],
})
export class BnplHelpComponent {
  private bottomSheetService = inject(NgxBottomSheetService);
  private installmentFeeService = inject(CreditInstallmentFeeService);

  bnplType = signal<string>(this.bottomSheetService.data().bnplType);
  customerType = signal<string>(this.bottomSheetService.data().customerType);
  pageTitle = signal<string>(this.bottomSheetService.data().pageTitle);
  isInApp = signal<boolean>(this.bottomSheetService.data().isInApp);

  data = computed<BnplHelpData>(() => {
    const bnplType = this.bnplType();
    const customerType = this.customerType();
    const feeDescription = this.getFeeDescription(this.installmentFeeService.feeDetails());

    if (bnplType === '1pay' && customerType === 'org') {
      return organizational1PayBnplHelpData;
    } else if (bnplType === '1pay' && customerType === 'individual') {
      return individual1PayBnplHelpData;
    } else if (bnplType === '4pay' && customerType === 'org') {
      (organizational4PayHowUseSection.items[2] as LandingElementAlertBox).payload.description = feeDescription;
      return organizational4PayBnplHelpData;
    } else if (bnplType === '4pay' && customerType === 'individual') {
      (individual4PayHowUseSection.items[2] as LandingElementAlertBox).payload.description = feeDescription;
      return individual4PayBnplHelpData;
    }
    return individual1PayBnplHelpData;
  });

  getFeeDescription(feeDetails: FeeDetails | null): string {
    const feeDescription = 'در صورت استفاده، معادل fee به عنوان هزینه خدمات و زیرساخت در اقساط محاسبه و دریافت می‌شود.';
    let fee = '<b>' + 'کارمزد توافق شده' + '</b>';

    if (feeDetails) {
      switch (feeDetails.type) {
        case FeeDetailType.FIX_AMOUNT: {
          const amount = currencyFormat(feeDetails.value, ',') + ' ریال';
          fee = '<b>' + amount + '</b>';
          break;
        }
        case FeeDetailType.PERCENTAGE: {
          fee = '<b>' + feeDetails.value + '%</b>' + ' از اعتبار اقساطی مصرف شده';
          break;
        }
      }
    }
    return feeDescription.replace('fee', fee);
  }
}
