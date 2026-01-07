import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FUND_PROVIDER_CODE } from '../../data-access/models/credit/fund-provider/fund-provider-code';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'app-credit-prepayment-no-fund-bottom-sheet',
  templateUrl: './credit-prepayment-no-fund-bottom-sheet.component.html',
  styleUrls: ['./credit-prepayment-no-fund-bottom-sheet.component.scss'],
  standalone: true,
  imports: [NgxButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditPrepaymentNoFundBottomSheetComponent implements OnInit {
  fundProviderCode!: number;
  title = signal<string | null>(null);
  description = signal<string | null>(null);

  bottomSheetService = inject(NgxBottomSheetService);

  ngOnInit(): void {
    this.fundProviderCode = this.bottomSheetService.data().fundProviderCode;
    switch (this.fundProviderCode) {
      case FUND_PROVIDER_CODE.TEJARAT:
        this.title.set('شروع تخصیص اعتبار از فروردین ماه');
        this.description.set('با توجه به برنامه‌ریزی زمانی بانک، تخصیص اعتبار از ۱۴۰۳/۰۱/۰۵ شروع می‌شود. آیا از پرداخت خود مطمئن هستید؟');
        break;
      case FUND_PROVIDER_CODE.MELLAT:
        this.title.set('شروع تخصیص اعتبار از فروردین ماه');
        this.description.set('با توجه به برنامه‌ریزی زمانی بانک، تخصیص اعتبار از۱۴۰۳/۰۱/۰۵ شروع می‌شود. آیا از پرداخت خود مطمئن هستید؟');
    }
  }

  close(status: boolean) {
    this.bottomSheetService.outputData.set(status);
    this.bottomSheetService.closeBottomSheet();
  }
}
