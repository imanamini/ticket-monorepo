import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { NgxBottomSheetHeaderComponent, NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';

@Component({
  selector: 'app-credit-cheque-sayad-hint-bottom-sheet',
  templateUrl: './credit-cheque-sayad-hint-bottom-sheet.component.html',
  styleUrls: ['./credit-cheque-sayad-hint-bottom-sheet.component.scss'],
  imports: [NgxButtonComponent, NgxTrackableIdDirective, NgxBottomSheetHeaderComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditChequeSayadHintBottomSheetComponent {
  allIcons = [
    ['pasargad', 'mehr', 'shahr', 'resalat', 'refah'],
    ['saderat', 'aap', 'sepah', 'post', 'melli', 'mellat'],
  ];

  private bottomSheetService = inject(NgxBottomSheetService);

  close() {
    this.bottomSheetService.closeBottomSheet();
  }
}
