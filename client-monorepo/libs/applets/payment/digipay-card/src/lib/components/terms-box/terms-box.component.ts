import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxCheckboxComponent } from '@digipay/ngx-checkbox';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { TermsComponent } from '../terms/terms.component';

@Component({
  selector: 'digipay-card-applet-terms-box',
  standalone: true,
  imports: [CommonModule, NgxCheckboxComponent],
  templateUrl: './terms-box.component.html',
  styleUrl: './terms-box.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TermsBoxComponent {
  termsAccepted = signal<boolean>(false);
  onApproveTerms = output<boolean>();
  private readonly bottomSheetService = inject(NgxBottomSheetService);

  openRulesAndConditions() {
    this.bottomSheetService.openBottomSheet(TermsComponent,{}, { disableClose: false, maxHeight: '80%' });
  }
  onAcceptingTerms() {
    this.onApproveTerms.emit(!this.termsAccepted());
    this.termsAccepted.set(!this.termsAccepted());
  }
}
