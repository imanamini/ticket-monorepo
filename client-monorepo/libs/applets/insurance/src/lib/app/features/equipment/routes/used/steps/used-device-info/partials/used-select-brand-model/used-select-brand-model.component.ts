import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Observable, Subscription } from 'rxjs';
import { UsedCustomBrandModelComponent } from '../used-custom-brand-model/used-custom-brand-model.component';
import { LoggedInUser } from '../../../../../../../../data-access/models/logged-in-user.model';
import { LoadingService } from '../../../../../../../../data-access/services/loading.service';
import { UsedStoredDeviceInfoModel } from '../../models/used-stored-device-info.model';
import { UsedDeviceInfoService } from '../../services/used-device-info.service';
import { SharedUsedService } from '../../../../services/shared-used.service';
import { RegisterTypes } from '../../models/used-register-types.model';
import { UsedBrandPickerComponent } from '../used-brand-picker/used-brand-picker.component';
import { AsyncPipe, Location, NgIf } from '@angular/common';
import { UsedModelPickerComponent } from '../used-model-picker/used-model-picker.component';
import {
  UiLoadingSpinnerComponent
} from '../../../../../../../../components/ui-loading-spinner/ui-loading-spinner.component';
import { BrandModel } from '../../../../../../api/models/used/brand.model';
import { NgxHybridServiceService } from '@digipay/ngx-hybrid-service';
import { IntrackService } from '../../../../../../../../data-access/services/intrack.service';

@Component({
  selector: 'used-select-brand-model',
  templateUrl: './used-select-brand-model.component.html',
  standalone: true,
  imports: [
    UsedBrandPickerComponent,
    UsedModelPickerComponent,
    AsyncPipe,
    UiLoadingSpinnerComponent
  ],
  styleUrls: ['./used-select-brand-model.component.scss']
})
export class UsedSelectBrandModelComponent implements OnInit, OnDestroy {

  @Output()
  dataCompleted = new EventEmitter<{
    brand: BrandModel,
    model: BrandModel
  }>();
  isFromWebApp = this.sharedService.getIsUserFromWebAppValue();
  isHybridApp = this.ngxHybridServiceService.isHybrid();
  subscriptions: Subscription[] = [];
  userInfo: LoggedInUser;
  selectedBrand: BrandModel;
  selectedModel: BrandModel;
  showBrandPicker$: Observable<boolean> = this.deviceInfoService.getShowBrandPicker();
  loading$: Observable<boolean> = this.loadingService.getLoading();
  storedDeviceInfo: UsedStoredDeviceInfoModel;

  constructor(
    private bottomSheet: MatBottomSheet,
    private deviceInfoService: UsedDeviceInfoService,
    private loadingService: LoadingService,
    private ngxHybridServiceService: NgxHybridServiceService,
    private location: Location,
    private intrackService: IntrackService,
    private sharedService: SharedUsedService) {
    this.deviceInfoService.setShowCustomBrandModel(false);
  }

  ngOnInit(): void {
    this.getStoredDeviceInfo();
    this.subscribeOnCustomBrandModel();
    this.subscribeOnBackClick();
  }

  getStoredDeviceInfo(): void {
    this.storedDeviceInfo = this.deviceInfoService.getStoredDeviceInfo();
    if (this.storedDeviceInfo?.brandTitle) {
      this.selectedBrand = {
        ...this.selectedBrand,
        title: this.storedDeviceInfo.brandTitle,
        id: this.storedDeviceInfo.brandId ? this.storedDeviceInfo.brandId : null
      };
    }
    if (this.storedDeviceInfo?.modelTitle) {
      this.selectedModel = {
        ...this.selectedModel,
        title: this.storedDeviceInfo.modelTitle,
        id: this.storedDeviceInfo.modelId ? this.storedDeviceInfo.modelId : null
      };
    }
  }

  subscribeOnCustomBrandModel(): void {
    const subscription = this.deviceInfoService.getShowCustomBrandModel()
      .subscribe({
        next: (isShown) => {
          if (isShown) {
            this.showCustomBrandModelBottomSheet();
          }
        }
      });
    this.subscriptions.push(subscription);
  }

  subscribeOnBackClick(): void {
    this.resetSelectedBrandModel();
    const subscription = this.sharedService.getBackClick()
      .subscribe((value: any) => {
        if (this.isFromWebApp || this.ngxHybridServiceService.isHybrid()) {
          if (this.ngxHybridServiceService.isHybrid()) {
            this.ngxHybridServiceService.close();
          } else {
            window.location.href = window.location.origin;
          }
        } else {
          this.location.back();
        }
      });
    this.subscriptions.push(subscription);
  }

  resetSelectedBrandModel(): void {
    this.deviceInfoService.setStoredDeviceInfo({
      brandId: null,
      brandTitle: null,
      modelId: null,
      modelTitle: null,
      serialNumber: null
    });
  }

  handleBrandSelect(event: BrandModel): void {
    this.selectedBrand = event;
    this.deviceInfoService.setShowBrandPicker(false);
  }

  handleModelSelect(event: BrandModel): void {
    this.selectedModel = event;
    this.emitData();
  }

  showCustomBrandModelBottomSheet(): void {
    const storedDeviceInfo = this.deviceInfoService.getStoredDeviceInfo();
    const refDialog = this.bottomSheet
      .open(UsedCustomBrandModelComponent,
        {
          data: {
            model: storedDeviceInfo?.modelTitle ? storedDeviceInfo.modelTitle : null,
            brand: storedDeviceInfo?.brandTitle ? storedDeviceInfo.brandTitle : null
          }
        })
      .afterDismissed()
      .toPromise()
      .then((data) => {
        if (data) {
          // Send Intrack Event
          this.intrackService.sendIntrackEvent('I_BMC', {
            DeviceBrand: data.brand ?? '',
            DeviceModel: data.model ?? ''
          });
          this.selectedBrand = {
            ...this.selectedBrand,
            title: data.brand,
            englishTitle: data.brand
          };
          this.selectedModel = {
            ...this.selectedModel,
            title: data.model,
            englishTitle: data.model
          };
          this.deviceInfoService.setStoredDeviceInfo({
            brandTitle: this.selectedBrand.title,
            brandId: null,
            modelTitle: this.selectedModel.title,
            modelId: null,
          });
          this.deviceInfoService.setRegisterType(RegisterTypes.CustomBrandModel);
          this.emitData();
        }
      });
  }

  emitData(): void {
    this.dataCompleted.emit({model: this.selectedModel, brand: this.selectedBrand});
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s && s.unsubscribe());
  }
}
