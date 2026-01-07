import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxBottomSheetHeaderComponent, NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { UserAddress } from '../../../data-access/models/credit/profile/credit-profile-response.model';
import { SelectionBoxComponent } from '../../../components/selection-box/selection-box.component';
import { NgxIcon } from '@digipay/ngx-icon';
import { CreditScrollableViewComponent } from '../../../components/credit-scrollable-view/credit-scrollable-view.component';

@Component({
  selector: 'app-credit-profile-addresses-bottom-sheet',
  standalone: true,
  imports: [NgxButtonComponent, SelectionBoxComponent, NgxIcon, NgxBottomSheetHeaderComponent, CreditScrollableViewComponent],
  templateUrl: './credit-profile-addresses-bottom-sheet.component.html',
  styleUrl: './credit-profile-addresses-bottom-sheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditProfileAddressesBottomSheetComponent {
  recentAddresses = signal<any[]>([]);
  newAddressSelected = computed(() => !this.recentAddresses().some((item) => item.listOption.selected));
  selectedAddress = signal<any>(null);
  selectedAddressIndex = signal<number | undefined>(undefined);
  bottomSheetService = inject(NgxBottomSheetService);
  constructor() {
    const { data } = this.bottomSheetService.data();
    const uniqueArray = Array.from(
      new Map(
        data.map((item: UserAddress) => {
          item.listOption = {
            label: item.address,
            value: '',
            selected: false,
          };
          return [JSON.stringify(item), item];
        }),
      ).values(),
    );
    this.recentAddresses.set(uniqueArray);
  }

  onClose(): void {
    this.bottomSheetService.outputData.set(this.selectedAddress());
    this.bottomSheetService.closeBottomSheet();
  }

  selectAddress(address?: any, index?: number) {
    this.recentAddresses.set(
      JSON.parse(
        JSON.stringify(
          this.recentAddresses().map((item: UserAddress, i) => {
            const newItem = { ...item };
            if (newItem.listOption) {
              newItem.listOption = { ...newItem.listOption, selected: false };
            }
            if (address && i === index) {
              if (newItem.listOption) {
                newItem.listOption = { ...newItem.listOption, selected: true };
              }
            }
            return newItem;
          }),
        ),
      ),
    );

    this.selectedAddress.set(address);
    this.selectedAddressIndex.set(index);
  }
}
