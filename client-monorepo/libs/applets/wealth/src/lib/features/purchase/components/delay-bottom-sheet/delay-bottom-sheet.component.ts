import { Component, inject, signal } from '@angular/core';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';

@Component({
  selector: 'app-delay-bottom-sheet',
  standalone: true,
  imports: [NgxButtonComponent],
  templateUrl: './delay-bottom-sheet.component.html',
  styleUrl: './delay-bottom-sheet.component.scss',
})
export class DelayBottomSheetComponent {
  private bottomSheet = inject(NgxBottomSheetService);
  data = signal<{ isPurchase: boolean } | undefined>(undefined);

  constructor() {
    this.data.set(this.bottomSheet.data().data);
  }

  confirm() {
    this.bottomSheet.outputData.set(true);
    this.bottomSheet.closeBottomSheet();
  }

  close() {
    this.bottomSheet.closeBottomSheet();
  }
}
