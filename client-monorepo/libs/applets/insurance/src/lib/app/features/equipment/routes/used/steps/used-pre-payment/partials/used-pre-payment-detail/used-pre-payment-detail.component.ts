import { Component, inject, Inject, OnInit, signal } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { CardNoticeComponent } from '../../../../../../../../components/card-notice/card-notice.component';
import { UiButtonComponent } from '../../../../../../../../components/ui-button/ui-button/ui-button.component';
import { Router } from '@angular/router';
import { InsDigikalaService } from '../../../../../../../../data-access/services/ins-digikala.service';

@Component({
  selector: 'used-used-pre-payment-detail',
  templateUrl: './used-pre-payment-detail.component.html',
  standalone: true,
  imports: [CardNoticeComponent, UiButtonComponent],
  styleUrls: ['./used-pre-payment-detail.component.scss'],
})
export class UsedPrePaymentDetailComponent implements OnInit {
  dynamicCoverages: string[] = [];
  staticCoverages: string[] | any;
  private digikalaService = inject(InsDigikalaService);
  btnTitle = signal<string>('');

  constructor(
    private route: Router,
    private bottomSheetRef: MatBottomSheetRef,
    @Inject(MAT_BOTTOM_SHEET_DATA) public sheetData: any,
  ) {
    if (this.digikalaService.isDigikala) {
      this.btnTitle.set('متوجه شدم');
    } else {
      this.btnTitle.set('اطلاعات بیشتر');
    }
  }

  ngOnInit(): void {
    this.dynamicCoverages = this.sheetData;
    this.staticCoverages = [
      'پایین‌ترین قیمت حق بیمه',
      'پوشش سرقت بدون قید و شرط تنها با مستندات قضایی',
      'امکان تعمیر کالای آسیب دیده به صورت رایگان',
      'پرداخت خسارت با یک کلیک',
    ];
  }

  goToMoreInfo(): void {
    if (this.digikalaService.isDigikala) {
      this.bottomSheetRef.dismiss();
    } else {
      window.open('https://www.mydigipay.com/insurtech/equipment/?utm_source=InsurTechMoreInfoBut&utm_medium=DKBanner', '_blank');
    }
  }
}
