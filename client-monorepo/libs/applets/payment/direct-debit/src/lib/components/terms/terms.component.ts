import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'direct-debit-terms',
  standalone: true,
  imports: [CommonModule, NgxCalloutComponent, NgxButtonComponent],
  templateUrl: './terms.component.html',
  styleUrl: './terms.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TermsComponent {
  private readonly bottomSheet = inject<NgxBottomSheetService<any>>(NgxBottomSheetService);

  onClose() { 
    this.bottomSheet.closeBottomSheet();
  }
}
