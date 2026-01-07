import { Component, NgZone, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { UiButtonComponent } from '../../../../../../components/ui-button/ui-button/ui-button.component';

@Component({
  selector: 'health-check-full-screen',
  templateUrl: './health-check-full-screen.component.html',
  standalone: true,
  imports: [
    UiButtonComponent
  ],
  styleUrls: ['./health-check-full-screen.component.scss']
})
export class HealthCheckFullScreenComponent implements OnInit {

  constructor(public sheetRef: MatBottomSheetRef<HealthCheckFullScreenComponent>,
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
