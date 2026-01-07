import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { VehiclePlateDetails } from '../../../../api/digipay/models/driving-fine/vehicle-plate';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-ui-vehicle-simple-plate',
  templateUrl: './ui-vehicle-simple-plate.component.html',
  styleUrls: ['./ui-vehicle-simple-plate.component.scss'],
  standalone: true,
  imports: [NgClass, NgIf, ApiImageModule],
})
export class UiVehicleSimplePlateComponent implements OnInit {
  @Input()
  plateDetail: VehiclePlateDetails;

  @Input()
  plateNumber: string;

  @Input()
  showIcon = true;

  @Input()
  withoutBorder = false;

  plateParts = [];

  ngOnInit() {
    this.setPlateParts();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.plateNumber) {
      this.setPlateParts();
    }
  }

  setPlateParts() {
    if (!this.plateNumber) {
      return;
    }

    if (!this.plateDetail) {
      this.plateParts = [this.plateNumber.substr(0, 3), this.plateNumber.substr(3, 5)];
    } else {
      this.plateParts = [this.plateNumber.substr(0, 2), this.plateNumber.substr(4, 3), this.plateNumber.substr(7, 2)];
    }
  }
}
