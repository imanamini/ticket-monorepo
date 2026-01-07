import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { NgxBottomSheetHeaderComponent, NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxIcon } from '@digipay/ngx-icon';
import { ChequeStepDeliveryMethod } from '../../../../../data-access/models/credit/activation/cheque-step/cheque-step-delivery.model';
import { NgxBadgeModule } from '@digipay/ngx-badge';

type DeliveryMethod = {
  id: number;
  label: string;
  badge?: string;
  icon: string;
  isActive: boolean;
  enabled: boolean;
};
@Component({
  selector: 'app-credit-cheque-delivery-methods-bottom-sheet',
  templateUrl: './credit-cheque-delivery-methods-bottom-sheet.component.html',
  styleUrls: ['./credit-cheque-delivery-methods-bottom-sheet.component.scss'],
  imports: [NgxBottomSheetHeaderComponent, NgxIcon, NgxBadgeModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditChequeDeliveryMethodsBottomSheetComponent implements OnInit {
  types = signal<DeliveryMethod[]>([
    {
      id: ChequeStepDeliveryMethod.COURIER,
      label: 'پیک دیجی‌پی',
      badge: 'رایگان',
      icon: 'post-motor',
      isActive: false,
      enabled: false,
    },
    {
      id: ChequeStepDeliveryMethod.POST,
      label: 'ارسال چک با پست',
      icon: 'delivery-box',
      isActive: false,
      enabled: false,
    },
    {
      id: ChequeStepDeliveryMethod.IN_PERSON,
      label: 'مراجعه به شعبه',
      icon: 'building-office',
      isActive: false,
      enabled: false,
    },
  ]);

  private bottomSheetService = inject(NgxBottomSheetService);

  ngOnInit() {
    if (this.bottomSheetService.data()) {
      this.types.update((items) =>
        items.map((item) => ({
          ...item,
          enabled: this.bottomSheetService.data().deliveryMethods.includes(item.id),
        })),
      );
    }
  }

  toggleItem(id: number) {
    this.types.update((items) =>
      items.map((item) => ({
        ...item,
        isActive: item.id === id,
      })),
    );

    setTimeout(() => {
      const selectedMethod = this.types().find((item) => item.isActive);
      this.bottomSheetService.outputData.set(selectedMethod?.id);
      this.bottomSheetService.closeBottomSheet();
    }, 500);
  }

  close() {
    this.bottomSheetService.closeBottomSheet();
  }
}
