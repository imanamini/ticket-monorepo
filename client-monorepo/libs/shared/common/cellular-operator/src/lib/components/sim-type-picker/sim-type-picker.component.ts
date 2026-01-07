import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FramedIconComponent } from '@client-monorepo/common/ui-components';
import { ServiceImagesType } from '@client-monorepo/common/service-data';
import { SimTypeConfig } from '@client-monorepo/common/utilities';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';

@Component({
  selector: 'common-cellular-operator-sim-type-picker',
  standalone: true,
  imports: [CommonModule, FramedIconComponent],
  templateUrl: './sim-type-picker.component.html',
  styleUrls: ['./sim-type-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimTypePickerComponent {
  imageType = ServiceImagesType.ICON;
  sheetData: {
    currentOperatorTypes: Array<SimTypeConfig>;
  };

  constructor(private bottomSheetService: NgxBottomSheetService) {
    this.sheetData = this.bottomSheetService.data();
  }

  continuePurchase(simType: string): void {
    this.bottomSheetService.outputData.set({
      simType,
    });
    this.bottomSheetService.closeBottomSheet();
  }
}
