import { Component, inject } from '@angular/core';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'device-value-guide',
  standalone: true,
  imports: [
    NgxCalloutComponent,
    NgxButtonComponent
  ],
  templateUrl: './device-value-guide.component.html'
})
export class DeviceValueGuideComponent {
  bottomSheet = inject(MatBottomSheetRef);

  closeBottomSheet(): void {
    this.bottomSheet.dismiss(true);
  }
}
