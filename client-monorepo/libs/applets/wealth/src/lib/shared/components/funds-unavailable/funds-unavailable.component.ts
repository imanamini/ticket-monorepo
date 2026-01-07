import { Component, inject } from '@angular/core';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { FundAddressesComponent } from './fund-addresses/fund-addresses.component';

@Component({
  selector: 'app-funds-unavailable',
  standalone: true,
  imports: [NgxButtonComponent],
  templateUrl: './funds-unavailable.component.html',
  styleUrl: './funds-unavailable.component.scss',
})
export class FundsUnavailableComponent {
  private bottomSheet = inject(NgxBottomSheetService);

  openBottomSheet() {
    this.bottomSheet.openBottomSheet(FundAddressesComponent, {
      data: 'test',
    });
  }
}
