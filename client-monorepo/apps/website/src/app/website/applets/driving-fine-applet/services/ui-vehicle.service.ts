import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PlateColor, VehiclePlateDetails } from '../../../../api/digipay/models/driving-fine/vehicle-plate';

@Injectable({
  providedIn: 'root',
})
export class UiVehicleService {
  /**
   * Configuration of plate colors
   */
  plateColors: BehaviorSubject<{
    [code: string]: PlateColor;
  }> = new BehaviorSubject({});

  generatePlateColors(plateDetails: VehiclePlateDetails[]) {
    const colors = {};
    plateDetails.forEach((pd) => {
      colors[pd.code] = {
        bgColor: pd.color,
        textColor: pd.fontColor,
      };
    });
    this.plateColors.next(colors);
  }
}
