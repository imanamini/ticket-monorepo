import { Component, inject } from '@angular/core';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';

@Component({
  selector: 'app-fund-addresses',
  standalone: true,
  imports: [NgxButtonComponent],
  templateUrl: './fund-addresses.component.html',
  styleUrl: './fund-addresses.component.scss',
})
export class FundAddressesComponent {
  private bottomSheet = inject(NgxBottomSheetService);

  onClose() {
    this.bottomSheet.closeBottomSheet();
  }

  gotoPage(href) {
    window.open('https://' + href);
  }
}
