import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DpIconComponent } from '@client-monorepo/common/icon';
import {
  PlateManagerChange,
  PlateManagerInputData,
  ScheduleChange,
  SchedulesApiService,
  StoredPlate,
} from '@client-monorepo/daily-fintech/vehicle-data';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'daily-vehicle-data-auto-pay',
  standalone: true,
  imports: [CommonModule, DpIconComponent, NgxButtonComponent],
  templateUrl: './auto-pay.component.html',
  styleUrl: './auto-pay.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutoPayComponent {
  bottomSheetService = inject(NgxBottomSheetService);
  scheduleApiService = inject(SchedulesApiService);
  data: PlateManagerInputData | null;

  constructor() {
    this.data = this.bottomSheetService.data();
  }

  submit(isAutoPay: boolean) {
    const plate = this.data?.plate;
    if (!plate) {
      return;
    }
    if (isAutoPay) {
      this.scheduleApiService.createSchedule(plate.plateNo).subscribe({
        next: () => {
          this.setBottomSheetOutPutData(plate, 'add', 'add');
        },
        error: () => {
          this.setBottomSheetOutPutData(plate, 'no-change', 'no-change');
        },
      });
    } else {
      this.setBottomSheetOutPutData(plate, 'no-change', 'no-change');
    }
  }

  private setBottomSheetOutPutData(plate: StoredPlate, changed: PlateManagerChange = 'no-change', schedule: ScheduleChange = 'no-change') {
    this.bottomSheetService.outputData.set({
      plate: plate,
      changed: changed,
      schedule: schedule,
    });
    this.bottomSheetService.closeBottomSheet();
  }
}
