import { Component } from '@angular/core';
import { PlanServices, SERVICES_TYPE } from '@client-monorepo/common/subscription';
import { formatPriceToString } from '@client-monorepo/common/utilities';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'subscription-applet-plan-alert-sheet',
  standalone: true,
  imports: [NgxButtonComponent],
  templateUrl: './plan-alert-sheet.component.html',
  styleUrls: ['./plan-alert-sheet.component.scss'],
})
export class PlanAlertSheetComponent {
  amount!: string;

  constructor(private bottomSheetService: NgxBottomSheetService) {
    this.getCreditNumber();
  }

  getCreditNumber(): void {
    const bottomSheetData = this.bottomSheetService.data();
    bottomSheetData.planServices.map((service: PlanServices) => {
      if (service.type === SERVICES_TYPE.CREDIT) {
        this.amount = formatPriceToString(+service.amount);
      }
    });
  }

  onSubmit(): void {
    this.bottomSheetService.outputData.set({ isAccepted: true });
    this.bottomSheetService.closeBottomSheet();
  }
}
