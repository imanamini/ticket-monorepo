import { BarcodeLoadingService } from './service/barcode-loading.service';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'lib-barcode-loading',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent],
  templateUrl: './barcode-loading.component.html',
  styleUrl: './barcode-loading.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarcodeLoadingComponent {
  loadingService = inject(BarcodeLoadingService);
}
