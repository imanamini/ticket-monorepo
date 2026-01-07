import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DESCRIPTIONS } from '../description-stepper/wallet-management-description.enum';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';

@Component({
  selector: 'wallet-mng-applet-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgxButtonComponent],
  standalone: true,
})
export class DescriptionComponent {
  private bottomSheet = inject(NgxBottomSheetService)
  protected readonly DESCRIPTIONS = DESCRIPTIONS;

  close(): void {
    this.bottomSheet.closeBottomSheet();
  }

}
