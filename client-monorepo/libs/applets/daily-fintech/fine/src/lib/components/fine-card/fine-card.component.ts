import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FinePlate,
  PlateManagerComponent,
  PlateManagerInputData,
  PlateManagerOutputData
} from '@client-monorepo/daily-fintech/vehicle-data';
import { VehicleCardComponent, VehicleCardStatus } from '@client-monorepo/daily-fintech/vehicle-card';
import { Router } from '@angular/router';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';

@Component({
  selector: 'fine-applet-fine-card',
  standalone: true,
  imports: [CommonModule, VehicleCardComponent],
  templateUrl: './fine-card.component.html',
  styleUrl: './fine-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FineCardComponent {
  router = inject(Router);
  plate = input.required<FinePlate>();
  status = computed<VehicleCardStatus>(() => {
    if (!this.plate().inquiryTrackingCode) {
      return 'need-inquiry';
    }
    if (!this.plate().totalDebtAmount) {
      return 'paid';
    }
    return 'unpaid';
  });
  editPlateBottomSheetService =
    inject<NgxBottomSheetService<PlateManagerOutputData<FinePlate>, PlateManagerInputData<FinePlate>>>(NgxBottomSheetService);
  delete = output<FinePlate>();
  edit = output<FinePlate>();

  onEdit() {
    this.editPlateBottomSheetService.openBottomSheet(PlateManagerComponent, { plate: this.plate(), hasSchedule: false });
    const bottomSheetSubscriber = this.editPlateBottomSheetService.onClose.subscribe(() => {
      bottomSheetSubscriber.unsubscribe();
      const outputData = this.editPlateBottomSheetService.outputData();
      if (outputData?.changed === 'delete') {
        this.delete.emit(this.plate());
      }
      if (outputData?.changed === 'edit' && outputData.plate) {
        this.edit.emit(outputData.plate);
      }
    });
  }

  onCtaClick(): void {
    if (this.plate().inquiryTrackingCode) {
      this.router.navigate(['fine', 'list', this.plate().inquiryTrackingCode]).then();
    } else {
      this.router.navigate(['fine', 'select-method', this.plate().plateNo]).then();
    }
  }
}
