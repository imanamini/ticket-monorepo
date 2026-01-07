import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NgxBottomSheetHeaderComponent, NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';

@Component({
  selector: 'app-credit-cheque-add-or-select-address-bottom-sheet',
  templateUrl: './credit-cheque-add-or-select-address-bottom-sheet.component.html',
  styleUrls: ['./credit-cheque-add-or-select-address-bottom-sheet.component.scss'],
  imports: [NgxBottomSheetHeaderComponent, NgxIcon, NgxButtonComponent, NgxTrackableIdDirective],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditChequeAddOrSelectAddressBottomSheetComponent {
  items = computed(() => [
    {
      id: 'new',
      label: 'افزودن آدرس جدید',
      icon: 'plus',
    },
    {
      id: 'edit',
      label: 'ویرایش آدرس',
      icon: 'edit-square',
    },
  ]);
  private bottomSheetService = inject(NgxBottomSheetService);

  selectItem(id: string) {
    this.bottomSheetService.outputData.set(id);
    this.bottomSheetService.closeBottomSheet();
  }

  close() {
    this.bottomSheetService.closeBottomSheet();
  }
}
