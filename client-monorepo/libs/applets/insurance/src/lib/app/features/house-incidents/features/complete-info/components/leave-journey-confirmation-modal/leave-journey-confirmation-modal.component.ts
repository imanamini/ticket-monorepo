import { Component, inject } from '@angular/core';
import { InsButtonComponent } from '../../../../../../components/ins-button/ins-button.component';
import { NgxIcon } from '@digipay/ngx-icon';
import { InsAlertComponent } from '../../../../../../components/ins-alert/ins-alert.component';
import { AlertColorEnum } from '../../../../../../data-access/enums/alert-color.enum';
import { InsButtonStyleEnum } from '../../../../../../data-access/enums/ins-button-style.enum';
import { InsButtonSizeEnum } from '../../../../../../data-access/enums/ins-button-size.enum';
import { BottomSheetService } from '../../../../../../data-access/services/bottom-sheet.service';

@Component({
  selector: 'leave-journey-confirmation-modal',
  standalone: true,
  imports: [
    InsButtonComponent,
    NgxIcon,
    InsAlertComponent
  ],
  templateUrl: './leave-journey-confirmation-modal.component.html',
  styleUrl: './leave-journey-confirmation-modal.component.scss'
})
export class LeaveJourneyConfirmationModalComponent {

  private bottomSheetService = inject(BottomSheetService);

  protected readonly AlertColorEnum = AlertColorEnum;
  protected readonly InsButtonStyleEnum = InsButtonStyleEnum;
  protected readonly InsButtonSizeEnum = InsButtonSizeEnum;

  leaveJourney(): void {
    this.bottomSheetService.closeCurrentBottomSheet(false);
  }

  continueJourney(): void {
    this.bottomSheetService.closeCurrentBottomSheet(true);
  }

}
