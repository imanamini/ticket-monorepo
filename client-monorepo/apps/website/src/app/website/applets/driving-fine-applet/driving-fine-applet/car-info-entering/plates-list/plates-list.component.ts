import { Component, EventEmitter, Inject, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { VehiclePlate } from '../../../../../../api/digipay/models/driving-fine/vehicle-plate';
import { FineDataService } from '../../../services/fine-data.service';
import { FineStateManagerService } from '../../../services/fine-state-manager.service';
import { NewPlateFineStates } from '../../car-fine-states';
import { FineApiService } from '../../../services/fine-api.service';
import { UiButtonComponent } from '../../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { UiSpinnerComponent } from '../../../../../../ui/ui-components/ui-loading/ui-spinner/ui-spinner.component';
import { UiVehicleFineComponent } from '../../../../../../ui/ui-components/ui-driving-fine/ui-vehicle-fine/ui-vehicle-fine.component';
import { NgIf, NgFor, isPlatformBrowser } from '@angular/common';
import { UiIconDirective } from '../../../../../../ui/ui-directive/ui-icon.directive';

@Component({
  selector: 'app-plates-list',
  templateUrl: './plates-list.component.html',
  styleUrls: ['./plates-list.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, UiVehicleFineComponent, UiSpinnerComponent, UiButtonComponent, UiIconDirective],
})
export class PlatesListComponent implements OnInit {
  @Output()
  enterNewPlateBtn = new EventEmitter();

  @Output()
  showInquiryLastReport = new EventEmitter();

  platesList: VehiclePlate[] = [];

  isPlatesLoaded = false;

  constructor(
    private fineDataService: FineDataService,
    private fineStateManagerService: FineStateManagerService,
    private fineApiService: FineApiService,
    @Inject(PLATFORM_ID) private platformId: string,
  ) {}

  ngOnInit(): void {
    this.loadPlatesList();
  }

  newPlateClicked() {
    this.enterNewPlateBtn.emit();

    this.scrollToTop();
  }

  loadPlatesList() {
    this.isPlatesLoaded = false;
    this.fineApiService.getPlates('CAR').subscribe((platesList) => {
      this.platesList = platesList.plates;
      this.isPlatesLoaded = true;
    });
  }

  newInquiry(carInfo: { title: string; plateNo: string }) {
    this.fineDataService.saveVehicleOnSessionStorage(carInfo.title, carInfo.plateNo);

    this.fineDataService.setCarInfo({
      title: carInfo.title,
      plateNo: carInfo.plateNo,
    });

    this.fineStateManagerService.jumpToCertainState(NewPlateFineStates.INQUIRY_METHOD_SELECT);

    this.scrollToTop();
  }

  showInquiryDetails(selectedPlate: VehiclePlate) {
    this.showInquiryLastReport.emit(selectedPlate);

    this.scrollToTop();
  }

  scrollToTop() {
    if (isPlatformBrowser(this.platformId)) {
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }
  }
}
