import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'escrow-conflict-applet-conflict-report',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent],
  templateUrl: './conflict-report.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConflictReportComponent {
  bottomSheetService = inject(NgxBottomSheetService);
  route = inject(Router);

  closeBottomSheet() {
    this.bottomSheetService.closeBottomSheet();
    this.route.navigate(['home']).then();
  }
}
