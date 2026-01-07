import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { terms } from './terms.const';

@Component({
  selector: 'digipay-card-applet-terms',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent, NgxCalloutComponent, DpIconComponent],
  templateUrl: './terms.component.html',
  styleUrl: './terms.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TermsComponent {
  bottomSheetService = inject(NgxBottomSheetService);
  terms = terms;
  approve() {
    this.bottomSheetService.closeBottomSheet();
  }
}
