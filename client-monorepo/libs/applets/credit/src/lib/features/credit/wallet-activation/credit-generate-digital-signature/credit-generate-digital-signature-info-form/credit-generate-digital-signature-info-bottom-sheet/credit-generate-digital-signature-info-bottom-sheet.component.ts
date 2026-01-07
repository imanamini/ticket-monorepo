import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';

import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxBottomSheetHeaderComponent, NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';

@Component({
  selector: 'app-credit-generate-digital-signature-info-bottom-sheet',
  standalone: true,
  imports: [NgxButtonComponent, NgxBottomSheetHeaderComponent, NgxCalloutComponent, NgxTrackableIdDirective],
  templateUrl: './credit-generate-digital-signature-info-bottom-sheet.component.html',
  styleUrl: './credit-generate-digital-signature-info-bottom-sheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditGenerateDigitalSignatureInfoBottomSheetComponent implements OnInit {
  descriptions = signal<string[]>([]);
  title = signal('');

  private bottomSheetService = inject(NgxBottomSheetService);

  ngOnInit() {
    this.title.set(this.bottomSheetService.data().title);
    this.descriptions.set(this.bottomSheetService.data().descriptions);
  }

  closeBottomSheet() {
    this.bottomSheetService.outputData.set({ confirm: true });
    this.bottomSheetService.closeBottomSheet();
  }
}
