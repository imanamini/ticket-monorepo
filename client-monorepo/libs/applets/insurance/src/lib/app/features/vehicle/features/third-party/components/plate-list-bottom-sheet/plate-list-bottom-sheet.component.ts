import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

import { EnterPlateDataModel } from '../enter-plate/models/enter-plate-data.model';
import { VehicleSharedService } from '../../../../data-access/services/vehicle-shared.service';
import { MyPlatesComponent } from '../../../../components/my-plates/my-plates.component';
import { ThirdPartyUrlsEnum } from '../../data-access/enums/third-party-urls.enum';
import { PlateService } from '../../data-access/services/plate.service';
import { InsuranceProductTypeEnum } from '../../../../../../data-access/enums/Insurance-product-type.enum';

@Component({
  selector: 'plate-list-bottom-sheet',
  standalone: true,
  imports: [
    MyPlatesComponent,
    NgxDividerComponent
  ],
  templateUrl: './plate-list-bottom-sheet.component.html',
  styleUrl: './plate-list-bottom-sheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlateListBottomSheetComponent {

  protected readonly BorderColorsEnum = BorderColorsEnum;
  private bottomSheetRef = inject(MatBottomSheetRef<PlateListBottomSheetComponent>);
  private shareService = inject(VehicleSharedService);
  private plateService = inject(PlateService);

  handleSelectPlate(e: EnterPlateDataModel): void {
    this.plateService.setPlateData(e);
    this.shareService.navigate(ThirdPartyUrlsEnum.Sanhab, {
      fragment: null,
      replace: true
    }, InsuranceProductTypeEnum.ThirdParty).then(() => {
      this.bottomSheetRef.dismiss(true);
    });
  }
}
