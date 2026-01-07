import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import BarcodeFormat from '@zxing/library/esm/core/BarcodeFormat';
import { MessageService } from '../../../../../data-access/services/message.service';
import { ScannedBill } from '../../../../../components/credit-qr-scanner/models/scanned-bill.model';
import { BarcodeScannerService } from '../../../../../components/credit-qr-scanner/barcode-scanner.service';
import { CreditQrScannerComponent } from '../../../../../components/credit-qr-scanner/credit-qr-scanner.component';

@Component({
  selector: 'app-credit-cheque-qr-scanner',
  templateUrl: './credit-cheque-qr-scanner.component.html',
  styleUrls: ['./credit-cheque-qr-scanner.component.scss'],
  imports: [CreditQrScannerComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditChequeQrScannerComponent {
  scanFormats = [BarcodeFormat.QR_CODE];

  private service = inject(BarcodeScannerService);
  private messageService = inject(MessageService);

  scanValidation(event: any) {
    if (typeof event !== 'string' && event.length < 40) {
      return false;
    }
    let valid = false;
    const resultArr = event.split('\n');
    const ibanRegex = new RegExp(/^IR\d{24}$/i);
    const ibanChequeIdRegex = new RegExp(/^IR\d{40}$/i);
    resultArr.map((item: string) => {
      const cleanStr = item.replace(/\s/gi, '').trim();
      if (ibanRegex.test(cleanStr)) {
        valid = true;
      }
      if (ibanChequeIdRegex.test(cleanStr)) {
        valid = true;
      }
    });
    return valid;
  }

  /**
   * Callback function
   * Being called when scan is successful
   */
  onScan(event: any) {
    if (this.scanValidation(event)) {
      const result = {
        scannedValue: event,
        billId: '',
        payId: '',
      } as ScannedBill;
      this.service.onScan.next(result);
      this.closeScanner();
    } else {
      this.messageService.showErrorMessage('بروز خطا در هنگام اسکن بارکد');
      this.closeScanner();
    }
  }

  /**
   * Close the scanner without sending a result
   */
  closeScanner() {
    this.service.data.next(null!);
  }
}
