import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { Router } from '@angular/router';
import { PaymentResult } from '../data-access/models/barcode.model';
import { IranianRialsPipe } from '@client-monorepo/shared/common/iranian-rials';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxTooltipDirective } from '@digipay/ngx-tooltip';

@Component({
  selector: 'lib-payment-result',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent, IranianRialsPipe, NgxTooltipDirective],
  templateUrl: './payment-result.component.html',
  styleUrl: './payment-result.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentResultComponent {
  private router = inject(Router);
  private bottomSheetService = inject(NgxBottomSheetService);
  data!: PaymentResult;

  constructor() {
    const base64String = this.bottomSheetService.data();
    if (base64String) {
      try {
        const fixedBase64 = base64String.replace(/-/g, '+').replace(/_/g, '/');
        const decodedString = decodeURIComponent(
          [...atob(fixedBase64)].map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`).join(''),
        );
        this.data = JSON.parse(decodedString);
      } catch {
        this.bottomSheetService.closeBottomSheet();
      }
    } else {
      this.bottomSheetService.closeBottomSheet();
    }
  }

  getKeyValue(obj: Record<string, string>): { key: string; value: string } {
    const val = Object.entries(obj)?.[0]; // Use [0] instead of .at(0) for better browser compatibility
    return {
      key: val?.[0] ?? '',
      value: val?.[1] ?? '',
    };
  }

  async copyToClipboard(text: string) {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        return;
      }
      this.fallbackCopyText(text);
    } catch {
      this.fallbackCopyText(text);
    }
  }

  fallbackCopyText(text: string) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    this.copyToClipboard(text);
  }

  closeBottomSheet() {
    this.bottomSheetService.closeBottomSheet();
    this.router.navigate(['/transactions']);
  }
}
