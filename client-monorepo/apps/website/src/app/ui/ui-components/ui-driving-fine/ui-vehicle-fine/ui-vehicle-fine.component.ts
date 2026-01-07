import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Fine, TrafficFinesDto } from '../../../../api/digipay/models/driving-fine/fine-config.response';
import { VehiclePlate, VehiclePlateDetails } from '../../../../api/digipay/models/driving-fine/vehicle-plate';
import { UiButtonComponent } from '../../ui-button/ui-button/ui-button.component';
import { UiCurrencyComponent } from '../../ui-formatters/ui-currency/currency.component';
import { UiVehicleSimplePlateComponent } from '../../ui-vehicle-simple-plate/ui-vehicle-simple-plate/ui-vehicle-simple-plate.component';
import { NgIf } from '@angular/common';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { UiIconDirective } from '../../../ui-directive/ui-icon.directive';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-ui-vehicle-fine',
  templateUrl: './ui-vehicle-fine.component.html',
  styleUrls: ['./ui-vehicle-fine.component.scss'],
  standalone: true,
  imports: [ApiImageModule, NgIf, UiVehicleSimplePlateComponent, UiCurrencyComponent, UiIconDirective, UiButtonComponent, NgxIcon],
})
export class UiVehicleFineComponent {
  @Input()
  fine: Fine;

  @Input()
  trafficFine: TrafficFinesDto;

  @Input()
  plateDetails: VehiclePlateDetails;

  @Input()
  vehiclePlateNo: string;

  @Input()
  vehiclePlate: VehiclePlate;

  @Output()
  fineDetailsRequest = new EventEmitter<VehiclePlate>();

  @Output()
  newInquiryRequest = new EventEmitter<{ title: string; plateNo: string }>();

  @Input()
  hasPayOption = false;

  @Input()
  hasInquiryOption = false;

  @Output()
  payRequest = new EventEmitter();

  newInquiry() {
    this.newInquiryRequest.emit({
      title: this.vehiclePlate.title,
      plateNo: this.vehiclePlate.plateNo,
    });
  }

  showFineDetails() {
    this.fineDetailsRequest.emit(this.vehiclePlate);
  }

  payFine() {
    this.payRequest.emit();
  }
}
