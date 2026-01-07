import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import { InquiryMethodType } from '../../../../../api/digipay/models/driving-fine/inquiry-method';
import { FineStateManagerService } from '../../services/fine-state-manager.service';
import { FineDataService } from '../../services/fine-data.service';
import { VehiclePlateDetails } from '../../../../../api/digipay/models/driving-fine/vehicle-plate';
import { Subscription } from 'rxjs';
import { UiInquiryMethodCardComponent } from '../../../../../ui/ui-components/ui-inquiry-method-card/ui-inquiry-method-card/ui-inquiry-method-card.component';
import {isPlatformBrowser, NgFor} from '@angular/common';
import { UiButtonComponent } from '../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { UiVehicleSimplePlateComponent } from '../../../../../ui/ui-components/ui-vehicle-simple-plate/ui-vehicle-simple-plate/ui-vehicle-simple-plate.component';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-inquiry-method-select',
  templateUrl: './inquiry-method-select.component.html',
  styleUrls: ['./inquiry-method-select.component.scss'],
  standalone: true,
  imports: [UiVehicleSimplePlateComponent, UiButtonComponent, NgFor, UiInquiryMethodCardComponent, NgxIcon],
})
export class InquiryMethodSelectComponent implements OnInit {
  subscriptions: Subscription[] = [];

  vehiclePlateDetails: VehiclePlateDetails;

  vehiclePlateNo: string;

  appDetailedInquiryLink: string;

  inquiryMethods = [
    {
      type: InquiryMethodType.GENERAL,
      title: 'استعلام کلی',
      description: 'بدون احراز هویت',
      hoverImageId: 'traffic-fine-total-method-hover-image',
      imageId: 'traffic-fine-total-method-image',
    },
    {
      type: InquiryMethodType.DETAILED,
      title: 'استعلام خلافی با جزییات',
      description: 'از طریق احراز هویت (کد ملی و شماره همراه) در اپلیکیشن دیجی‌پی',
      hoverImageId: 'traffic-fine-details-method-hover-image',
      imageId: 'traffic-fine-details-method-image',
    },
  ];

  selectedMethod: InquiryMethodType = InquiryMethodType.GENERAL;

  constructor(
    private fineStateManager: FineStateManagerService,
    private fineDataService: FineDataService,
  @Inject(PLATFORM_ID) private platformId:string
  ) {}

  ngOnInit(): void {
    this.subscriptions[0] = this.fineDataService.vehiclePlateLetterDetails.subscribe((vehiclePlateLetter) => {
      this.vehiclePlateDetails = vehiclePlateLetter;
    });

    this.subscriptions[1] = this.fineDataService.vehiclePlateNo.subscribe((vehiclePlateNumber) => {
      this.vehiclePlateNo = vehiclePlateNumber;
    });

    this.subscriptions[2] = this.fineDataService.fineInitialData.subscribe((initialData) => {
      this.appDetailedInquiryLink = initialData.detailedFineLink;
    });
  }

  nextStep() {
    if (this.selectedMethod === InquiryMethodType.DETAILED && isPlatformBrowser(this.platformId)) {
      window.location.href = this.appDetailedInquiryLink;
      return;
    }
    this.fineStateManager.nextStep();
  }

  changeInquiryMethod(inquiryMethodNo: InquiryMethodType) {
    this.selectedMethod = inquiryMethodNo;
    this.fineDataService.selectedInquiryMethodType.next(inquiryMethodNo);
  }

  previousStep() {
    this.fineStateManager.previousStep();
  }
}
