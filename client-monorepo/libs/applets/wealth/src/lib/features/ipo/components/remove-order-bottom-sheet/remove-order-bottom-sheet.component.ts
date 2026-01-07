import { Component, inject, OnInit, signal } from '@angular/core';

import { NgxButtonComponent } from '@digipay/ngx-button';
import { EIpoPaymentMethodAgreement } from '../../../choice-payment-way/models/ipo-payment-method-agreement';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-remove-order-bottom-sheet',
  standalone: true,
  imports: [NgxButtonComponent, NgClass],
  templateUrl: './remove-order-bottom-sheet.component.html',
  styleUrl: './remove-order-bottom-sheet.component.scss',
})
export class RemoveOrderBottomSheetComponent implements OnInit {
  protected readonly EIpoPaymentMethodAgreement = EIpoPaymentMethodAgreement;
  buttons = signal<{ label: string; style: string }[]>([
    {
      label: 'بستن',
      style: 'tinted-on-elevated',
    },
    {
      label: 'حذف درخواست',
      style: 'fill',
    },
  ]);

  selectedPaymentMethod = signal<string | undefined>(undefined);

  private bottomSheet = inject(NgxBottomSheetService);

  ngOnInit() {
    this.selectedPaymentMethod.set(this.bottomSheet.data().selectedPaymentMethod);
  }

  close(removeOrder: boolean) {
    this.bottomSheet.outputData.set(removeOrder);
    this.bottomSheet.closeBottomSheet();
  }
}
