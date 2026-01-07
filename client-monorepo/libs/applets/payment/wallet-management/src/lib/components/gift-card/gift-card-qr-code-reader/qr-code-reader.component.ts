import { ChangeDetectionStrategy, Component, inject, model, OnDestroy, signal } from '@angular/core';
import { BarcodeFormat } from '@zxing/library';
import { Location, NgIf } from '@angular/common';
import { GenerateVoucherCode } from '../generate-voucher-code.service';
import { WalletManagementApiService } from '../../../data-access/services/wallet-management-api.service';
import { MessageService } from '@client-monorepo/common/utilities';
import { RedeemResponseInterface } from '../../../data-access/models/redeem.interface';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { BackHandlerService } from '@client-monorepo/back-handler';

@Component({
  selector: 'wallet-mng-applet-qr-code-reader',
  templateUrl: './qr-code-reader.component.html',
  styleUrls: ['./qr-code-reader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZXingScannerModule, NgIf, NgxSpinnerModule, PageLayoutComponent],
  standalone: true,
})
export class QrCodeReaderComponent implements OnDestroy {
  public tryHarder = false;
  public accessCamera = signal(true);
  public currentDevice = model<MediaDeviceInfo | undefined>(undefined);
  public hasPermission: boolean | null = null;
  public formatsEnabled: BarcodeFormat[] = [BarcodeFormat.QR_CODE];
  private api = inject(WalletManagementApiService);
  private message = inject(MessageService);
  private location = inject(Location);
  private availableDevices!: MediaDeviceInfo[];
  private hasDevices!: boolean;
  private qrResultString!: string | null;
  backHandler = inject(BackHandlerService);

  public clearResult(): void {
    this.qrResultString = null;
  }
  public onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices = devices;
    this.hasDevices = Boolean(devices && devices.length);
  }

  public onCodeResult(resultString: string): void {
    this.qrResultString = resultString;
    this.redeemVouchers();
  }

  public onDeviceSelectChange(selected: string): void {
    const device = this.availableDevices.find((x: MediaDeviceInfo) => x.deviceId === selected);
    this.currentDevice.set(device || undefined);
  }

  public onHasPermission(has: boolean): void {
    this.hasPermission = has;
  }

  public back(): void {
    this.backHandler.goBack();
  }

  private redeemVouchers(): void {
    this.accessCamera.set(false);
    const voucherCode: string = new GenerateVoucherCode().generateFromQrCodeUrl(this.qrResultString as string);
    this.api.redeemVouchers(voucherCode).subscribe({
      next: (redeemResponse: RedeemResponseInterface) => {
        this.message.showSuccessMessage(redeemResponse.result.message);
        this.backHandler.goBack();
      },
      error: (error) => {
        this.message.showErrorOfErrorResponse(error);
        this.accessCamera.set(true);
      },
    });
  }

  ngOnDestroy(): void {
    this.hasPermission = false;
  }
}
