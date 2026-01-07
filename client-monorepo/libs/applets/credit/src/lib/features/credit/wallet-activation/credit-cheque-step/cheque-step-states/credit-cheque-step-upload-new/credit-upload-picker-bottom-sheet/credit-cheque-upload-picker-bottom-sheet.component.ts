import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NgxBottomSheetHeaderComponent, NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxIcon } from '@digipay/ngx-icon';
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
  selector: 'app-credit-cheque-upload-picker-bottom-sheet',
  templateUrl: './credit-cheque-upload-picker-bottom-sheet.component.html',
  styleUrls: ['./credit-cheque-upload-picker-bottom-sheet.component.scss'],
  imports: [NgxBottomSheetHeaderComponent, NgxIcon, NgxBadgeModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditChequeUploadPickerBottomSheetComponent {
  types = signal([
    {
      id: 'gallery',
      label: 'انتخاب عکس از گالری',
      icon: 'image',
      isActive: false,
    },
    {
      id: 'camera',
      label: 'عکاسی از چک',
      icon: 'camera',
      isActive: false,
    },
  ]);

  private bottomSheetService = inject(NgxBottomSheetService);

  toggleItem(id: string) {
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
}
