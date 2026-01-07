import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NationalStatus } from '../../../../data-access/models/credit/sign/national-status';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';

@Component({
  selector: 'app-credit-generate-digital-signature-national-card-type',
  templateUrl: './credit-generate-digital-signature-national-card-type.component.html',
  styleUrl: './credit-generate-digital-signature-national-card-type.component.scss',
  standalone: true,
  imports: [NgxButtonComponent, NgxIcon, NgxTrackableIdDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditGenerateDigitalSignatureNationalCardTypeComponent {
  protected nationalStatus = NationalStatus;

  bottomSheetService = inject(NgxBottomSheetService);

  types: {
    id: number;
    label: string;
    description: string;
    icon: string;
    isActive: boolean;
  }[] = [
    {
      id: this.nationalStatus.HAVE_NATIONAL_CARD,
      label: 'کارت ملی هوشمند دارم',
      description: '',
      icon: 'id-card',
      isActive: true,
    },
    {
      id: this.nationalStatus.NOT_HAVE_NATIONAL_CARD,
      label: 'رسید کارت ملی جدید دارم',
      description: ' رسید تحویل گرفته‌شده از پلیس +۱۰',
      icon: 'receipt-bill',
      isActive: false,
    },
  ];

  toggleItem(id: number) {
    this.types.forEach((item) => (item.isActive = false));
    this.types.find((item) => item.id === id)!.isActive = true;
  }

  confirm() {
    const selectedItemId = this.types.find((item) => item.isActive)!.id;
    this.bottomSheetService.outputData.set({ itemId: selectedItemId });
    this.bottomSheetService.closeBottomSheet();
  }
}
