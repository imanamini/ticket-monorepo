import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';

@Component({
  selector: 'digipay-card-applet-card-attachment-confirmation',
  standalone: true,
  imports: [CommonModule, DpIconComponent, NgxCalloutComponent, NgxButtonComponent],
  templateUrl: './card-attachment-confirmation.component.html',
  styleUrl: './card-attachment-confirmation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardAttachmentConfirmationComponent implements OnInit {
  data = { nationalCode: '' };
  bottomSheetService = inject(NgxBottomSheetService);
  ngOnInit(): void {
    this.data = this.bottomSheetService.data();
    
  }

  cancel() {
    this.bottomSheetService.outputData.set(false);
    this.bottomSheetService.closeBottomSheet();
  }
  approve() {
    this.bottomSheetService.outputData.set(true);
    this.bottomSheetService.closeBottomSheet();
  }
}
