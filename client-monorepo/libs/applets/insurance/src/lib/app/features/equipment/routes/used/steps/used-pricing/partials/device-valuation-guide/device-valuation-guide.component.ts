import { Component } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

import { UiButtonComponent } from '../../../../../../../../components/ui-button/ui-button/ui-button.component';
import { CardNoticeComponent } from '../../../../../../../../components/card-notice/card-notice.component';

@Component({
  selector: 'device-valuation-guide',
  standalone: true,
  imports: [
    CardNoticeComponent,
    UiButtonComponent
  ],
  templateUrl: './device-valuation-guide.component.html',
  styleUrl: './device-valuation-guide.component.scss'
})
export class DeviceValuationGuideComponent {

  constructor(private sheetRef: MatBottomSheetRef<DeviceValuationGuideComponent>) {
  }

  hintMessages: string[] = [
    'در صورتی که دستگاه خود را به تازگی خریداری کرده‌اید، مبلغ درج شده در فاکتور خرید ارزش فعلی دستگاه شما را نشان می‌دهد.',
    'در صورتی که مدتی از خرید دستگاه می‌گذرد یا قصد تمدید بیمه‌نامه خود را دارید، سایت‌هایی مانند دیجی‌کالا، ترب و ... می‌توانند مرجع مناسبی برای اطلاع از ارزش فعلی دستگاه شما باشند.',
  ];

  closeBottomSheet(): void {
    this.sheetRef.dismiss();
  }
}
