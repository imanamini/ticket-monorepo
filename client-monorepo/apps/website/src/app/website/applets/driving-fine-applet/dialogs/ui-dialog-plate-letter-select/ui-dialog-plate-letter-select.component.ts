import { Component } from '@angular/core';
import { DialogBottomSheetService } from '../../../../../core/services/dialog-bottom-sheet.service';
import { UiVehiclePlateLettersComponent } from '../../../../../ui/ui-components/ui-vehicle-plate-letter/ui-vehicle-plate-letters/ui-vehicle-plate-letters.component';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-ui-dialog-plate-letter-select',
  templateUrl: './ui-dialog-plate-letter-select.component.html',
  styleUrls: ['./ui-dialog-plate-letter-select.component.scss'],
  standalone: true,
  imports: [UiVehiclePlateLettersComponent, NgxIcon],
})
export class UiDialogPlateLetterSelectComponent {
  constructor(private dialog: DialogBottomSheetService) {}

  close(result?) {
    this.dialog.close(result);
  }
}
