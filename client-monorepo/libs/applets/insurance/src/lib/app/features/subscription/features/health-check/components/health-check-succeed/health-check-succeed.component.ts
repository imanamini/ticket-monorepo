import { Component, NgZone } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { UiButtonComponent } from '../../../../../../components/ui-button/ui-button/ui-button.component';

@Component({
  selector: 'health-check-succeed',
  templateUrl: './health-check-succeed.component.html',
  standalone: true,
  imports: [
    UiButtonComponent
  ],
  styleUrls: ['./health-check-succeed.component.scss']
})
export class HealthCheckSucceedComponent {

  constructor(public sheetRef: MatBottomSheetRef<HealthCheckSucceedComponent>,
              private zone: NgZone
  ) {
  }

  closeDialog(isAccepted: boolean): void {
    const result = {
      isAccepted,
    };
    this.zone.run(() => {
      this.sheetRef.dismiss(result);
    });
  }
}
