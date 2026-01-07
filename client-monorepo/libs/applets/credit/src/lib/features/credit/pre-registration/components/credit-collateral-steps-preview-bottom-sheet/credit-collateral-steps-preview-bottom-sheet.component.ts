import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { NgxBottomSheetHeaderComponent, NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { CreditPageLoadingComponent } from '../../../components/credit-page-loading/credit-page-loading.component';

@Component({
  selector: 'app-credit-activation-collateral-steps-preview',
  templateUrl: './credit-collateral-steps-preview-bottom-sheet.component.html',
  styleUrls: ['./credit-collateral-steps-preview-bottom-sheet.component.scss'],
  imports: [NgxButtonComponent, NgxTrackableIdDirective, NgxBottomSheetHeaderComponent, CreditPageLoadingComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditCollateralStepsPreviewBottomSheetComponent implements OnInit {
  collateral = signal<{ value: string; title: string } | null>(null);
  gettingData = signal<number | null>(null);
  dataMapper: {
    [key: string]: {
      title: string;
      description?: string;
      steps?: string[];
    };
  } = {
    NEW_CHEQUE: {
      title: 'مراحل ارائه ضمانت چک صیادی بنفش رنگ',
      steps: [
        'نوشتن چک مطابق راهنمایی که ارائه می‌شود',
        'ثبت چک در سامانه صیاد',
        'بارگذاری تصویر چک',
        'ارسال چک به دفتر دیجی‌پی',
        'بازگرداندن چک بعد از تسویه آخرین قسط',
      ],
    },
    E_NOTE: {
      title: 'مراحل ارائه ضمانت سفته',
      steps: ['خرید سفته', 'امضای سفته', 'تایید سفته'],
    },
  };

  private bottomSheetService = inject(NgxBottomSheetService);

  ngOnInit(): void {
    this.collateral.set(this.bottomSheetService.data());
  }

  close() {
    this.bottomSheetService.closeBottomSheet();
  }
}
