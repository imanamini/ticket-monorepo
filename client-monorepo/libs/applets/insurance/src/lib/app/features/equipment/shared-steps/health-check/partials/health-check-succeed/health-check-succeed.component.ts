import { Component, Inject, NgZone, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { SharedUsedService } from '../../../../routes/used/services/shared-used.service';
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
export class HealthCheckSucceedComponent implements OnInit {

  constructor(public sheetRef: MatBottomSheetRef<HealthCheckSucceedComponent>,
              @Inject(MAT_BOTTOM_SHEET_DATA) public sheetData: any,
              private service: SharedUsedService,
              private zone: NgZone
  ) {
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
