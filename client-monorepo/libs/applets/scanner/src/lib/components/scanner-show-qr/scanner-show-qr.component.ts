import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScannerApiService } from '../../data-access/services/scanner-api.service';

@Component({
  selector: 'scanner-applet-scanner-show-qr',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scanner-show-qr.component.html',
  styleUrl: './scanner-show-qr.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScannerShowQrComponent implements OnInit {
  private readonly scannerApiService = inject(ScannerApiService);
  isSupport = signal(false);
  loading = signal(false);
  qrData!: string;
  gettingBarcodeImage = true;

  ngOnInit(): void {
    this.checkCameraAccess();
  }

  checkCameraAccess(): void {
    this.getMyQrImage();
  }

  getMyQrImage() {
    this.loading.set(true);
    this.scannerApiService.generateMyQrImage().subscribe((data) => {
      const blob = new Blob([<Blob>data], { type: 'image/png' });
      const fileReader = new FileReader();

      fileReader.onload = () => {
        this.qrData = fileReader.result as string;
        this.gettingBarcodeImage = false;
        this.isSupport.set(true);
        this.loading.set(false);
      };

      fileReader.readAsDataURL(blob);
    });
  }

  get avatarStyles(): { [key: string]: string } {
    const styles: { [key: string]: string } = {};

    if (this.qrData) {
      styles['backgroundImage'] = 'url(' + this.qrData + ')';
      styles['backgroundSize'] = 'cover';
      styles['borderWidth'] = '0';
    }

    return styles;
  }
}
