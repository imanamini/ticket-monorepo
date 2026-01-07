import { Component, OnInit } from '@angular/core';
import { VehiclePlate, VehiclePlateDetails } from '../../../../../api/digipay/models/driving-fine/vehicle-plate';
import { FineDataService } from '../../services/fine-data.service';
import { Subscription } from 'rxjs';
import { FineApiService } from '../../services/fine-api.service';
import { UiVehicleFineComponent } from '../../../../../ui/ui-components/ui-driving-fine/ui-vehicle-fine/ui-vehicle-fine.component';
import { UiButtonComponent } from '../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { UiIconDirective } from '../../../../../ui/ui-directive/ui-icon.directive';

@Component({
  selector: 'app-fine-payment-result',
  templateUrl: './fine-payment-result.component.html',
  styleUrls: ['./fine-payment-result.component.scss'],
  standalone: true,
  imports: [UiButtonComponent, UiIconDirective, UiVehicleFineComponent],
})
export class FinePaymentResultComponent implements OnInit {
  plateDetails: VehiclePlateDetails;

  subscriptions: Subscription[] = [];

  vehiclePlateNo: string;

  vehiclePlate: VehiclePlate;

  constructor(
    private fineDataService: FineDataService,
    private fineApiService: FineApiService,
  ) {}

  ngOnInit(): void {
    this.subscriptions[0] = this.fineDataService.vehiclePlateLetterDetails.subscribe((vehiclePlateDetails) => {
      this.plateDetails = vehiclePlateDetails;
    });

    this.subscriptions[1] = this.fineDataService.vehiclePlateNo.subscribe((vehiclePlateNumber) => {
      this.vehiclePlateNo = vehiclePlateNumber;
    });

    this.fineDataService.loadCarInfoFromSessionStorage();

    this.fineApiService.getPlates('CAR').subscribe((plates) => {
      const platesList = plates.plates;
      if (platesList.length > 0) {
        this.vehiclePlate = platesList.find((plate) => plate.plateNo === this.vehiclePlateNo);
      }
    });
  }
}
