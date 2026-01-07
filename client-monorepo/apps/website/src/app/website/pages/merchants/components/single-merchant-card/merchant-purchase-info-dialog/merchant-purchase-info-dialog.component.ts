import {AfterViewInit, Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import { DialogBottomSheetService } from '../../../../../../core/services/dialog-bottom-sheet.service';
import { MerchantAddress, SingleMerchant } from '../../../../../../api/digipay/models/merchants/single-merchant.model';
import { environment } from '../../../../../../../environments/environment';
import { UiButtonComponent } from '../../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import {NgIf, NgOptimizedImage, NgFor, isPlatformBrowser} from '@angular/common';
import { UiIconDirective } from '../../../../../../ui/ui-directive/ui-icon.directive';

@Component({
  selector: 'app-merchant-purchase-info-dialog',
  templateUrl: './merchant-purchase-info-dialog.component.html',
  styleUrls: ['./merchant-purchase-info-dialog.component.scss'],
  standalone: true,
  imports: [NgIf, NgOptimizedImage, NgFor, UiIconDirective, UiButtonComponent],
})
export class MerchantPurchaseInfoDialogComponent implements OnInit, AfterViewInit {
  merchantInfo: SingleMerchant;

  protected readonly environment = environment;

  constructor(private dialogService: DialogBottomSheetService , @Inject(PLATFORM_ID) private platformId: string) {
    this.merchantInfo = this.dialogService.data.merchantInfo;
  }

  ngOnInit(): void {}

  locationClicked(address: MerchantAddress) {
    if(isPlatformBrowser(this.platformId)) {
      window.location.href = `https://maps.google.com/?q=${address.latitude},${address.longitude}`
    }
  }

  close() {
    this.dialogService.close();
  }

  ngAfterViewInit(): void {
    const addressContainer: HTMLDivElement = <HTMLDivElement>document.getElementsByClassName('addresses-container')[0];
    if (addressContainer.clientHeight >= 208) {
      addressContainer.style.paddingRight = '24px';
    }
  }
}
