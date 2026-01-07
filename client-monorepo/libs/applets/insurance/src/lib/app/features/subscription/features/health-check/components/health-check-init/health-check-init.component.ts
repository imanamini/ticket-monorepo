import { Component, NgZone, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { UiButtonComponent } from '../../../../../../components/ui-button/ui-button/ui-button.component';

@Component({
  selector: 'health-check-init',
  templateUrl: './health-check-init.component.html',
  standalone: true,
  imports: [
    UiButtonComponent
  ],
  styleUrls: ['./health-check-init.component.scss']
})
export class HealthCheckInitComponent implements OnInit {

  constructor(public sheetRef: MatBottomSheetRef<HealthCheckInitComponent>,
              private zone: NgZone) {
  }

  ngOnInit(): void {
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
