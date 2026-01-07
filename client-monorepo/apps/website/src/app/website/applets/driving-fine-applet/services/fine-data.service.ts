import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { InquiryMethodType } from '../../../../api/digipay/models/driving-fine/inquiry-method';
import { BehaviorSubject } from 'rxjs';
import { VehiclePlateDetails } from '../../../../api/digipay/models/driving-fine/vehicle-plate';
import { SectionFineInquiryAndPayment } from '../../../../api/clients/models/templates/car-fine/car-fine-template-data';
import { plateDetails } from '../driving-fine-applet/car-info-entering/plateDetails';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class FineDataService {
  public selectedInquiryMethodType: BehaviorSubject<InquiryMethodType> = new BehaviorSubject<InquiryMethodType>(InquiryMethodType.GENERAL);

  public vehicleTitle: BehaviorSubject<string> = new BehaviorSubject<string>('ماشین من');

  public vehiclePlateNo: BehaviorSubject<string> = new BehaviorSubject<string>('');

  public vehiclePlateLetterDetails: BehaviorSubject<VehiclePlateDetails> = new BehaviorSubject<VehiclePlateDetails>(null);

  public fineInitialData: BehaviorSubject<SectionFineInquiryAndPayment> = new BehaviorSubject<SectionFineInquiryAndPayment>(null);

  constructor(@Inject(PLATFORM_ID) private platformId: string) {}

  loadCarInfoFromSessionStorage() {
    if (isPlatformBrowser(this.platformId)) {
      if (!sessionStorage.getItem('carInfo')) {
        return;
      }
      const parsedCarInfo: { plateTitle: string; plateNo: string } = JSON.parse(sessionStorage.getItem('carInfo'));

      this.setCarInfo({
        title: parsedCarInfo.plateTitle,
        plateNo: parsedCarInfo.plateNo,
      });

      return parsedCarInfo;
    }
  }

  saveVehicleOnSessionStorage(title: string, plateNo: string) {
    const stringifiedCarInfo = JSON.stringify({ title, plateNo });
    sessionStorage.setItem('carInfo', stringifiedCarInfo);
  }

  clearVehicleDetailOnSessionStorage() {
    sessionStorage.clear();
  }

  setCarInfo(carInfo: { title: string; plateNo: string }) {
    this.vehicleTitle.next(carInfo.title);

    this.vehiclePlateNo.next(carInfo.plateNo);

    this.setPlateLetterDetailByCode(carInfo.plateNo.slice(2, 4));
  }

  setPlateLetterDetailByCode(plateLetterCode: string) {
    const plateDetail = this.getPlateLetterDetail(plateLetterCode);

    this.vehiclePlateLetterDetails.next(plateDetail);
  }

  getPlateLetterDetail(plateLetterCode: string) {
    return plateDetails.find((item) => item.code === plateLetterCode);
  }
}
