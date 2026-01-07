import { Component, inject } from '@angular/core';
import { NgxIcon } from '@digipay/ngx-icon';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { InsButtonSizeEnum } from '../../../../../../../data-access/enums/ins-button-size.enum';
import { InsButtonModeEnum } from '../../../../../../../data-access/enums/ins-button-mode.enum';
import { InsButtonStyleEnum } from '../../../../../../../data-access/enums/ins-button-style.enum';
import { InsButtonComponent } from '../../../../../../../components/ins-button/ins-button.component';

@Component({
  selector: 'voucher-remove',
  standalone: true,
  imports: [
    InsButtonComponent,
    NgxIcon
  ],
  templateUrl: './voucher-remove.component.html',
  styleUrl: './voucher-remove.component.scss'
})
export class VoucherRemoveComponent {

  protected readonly InsButtonStyleEnum = InsButtonStyleEnum;
  protected readonly InsButtonModeEnum = InsButtonModeEnum;
  protected readonly InsButtonSizeEnum = InsButtonSizeEnum;

  private sheetRef = inject(MatBottomSheetRef<VoucherRemoveComponent>);

  close(result?: boolean): void {
    this.sheetRef.dismiss(result);
  }

}
