import { Component, EventEmitter, inject, OnDestroy, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { UsedDeviceInfoService } from '../../services/used-device-info.service';
import { AppWindow } from '../../../../../../../../data-access/web-interfaces/app-window';
import { SharedUsedService } from '../../../../services/shared-used.service';
import { MessageService } from '@client-monorepo/common/utilities';
import { UsedApiService } from '../../../../../../api/services/used/used-api.service';
import { UsedDeviceInfoModel } from '../../models/used-device-info.model';
import { UsedStoredDeviceInfoModel } from '../../models/used-stored-device-info.model';
import { RegisterTypes } from '../../models/used-register-types.model';
import { UsedHeaderButtonModes } from '../../../../partials/used-header/models/used-header-button.modes';
import { AsyncPipe, Location, } from '@angular/common';
import { UsedDeviceDetailsCardComponent } from '../used-device-details-card/used-device-details-card.component';
import { JourneyButtonsComponent } from '../../../../../../partials/journey-buttons/journey-buttons.component';
import {
  UiLoadingSpinnerComponent
} from '../../../../../../../../components/ui-loading-spinner/ui-loading-spinner.component';
import { PurchaseHistoryListModel } from '../../../../../../api/models/used/purchase-history-list.model';
import { ProductCategoryModel } from '../../../../../../api/models/policy/product-category.model';
import { NgxHybridServiceService } from '@digipay/ngx-hybrid-service';
import { IntrackService } from '../../../../../../../../data-access/services/intrack.service';
import { LoginService } from '../../../../../../../../data-access/services/user-services/login.service';

declare const window: AppWindow;

@Component({
  selector: 'used-devices-list',
  templateUrl: './used-devices-list.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    UsedDeviceDetailsCardComponent,
    JourneyButtonsComponent,
    UiLoadingSpinnerComponent,
  ],
  styleUrls: ['./used-devices-list.component.scss']
})
export class UsedDevicesListComponent implements OnInit, OnDestroy {

  private deviceInfoService = inject(UsedDeviceInfoService);
  private sharedService = inject(SharedUsedService);
  private messageService = inject(MessageService);
  private ngxHybridServiceService = inject(NgxHybridServiceService);
  public intrackService = inject(IntrackService);
  private location = inject(Location);
  private usedApi = inject(UsedApiService);
  private loginService = inject(LoginService);

  @Output()
  deviceSelected = new EventEmitter<PurchaseHistoryListModel>();
  isFromNativeApp = this.sharedService.getIsUserFromNativeAppValue();
  isHybridApp = this.ngxHybridServiceService.isHybrid();
  isFromWebApp = this.sharedService.getIsUserFromWebAppValue();
  subscriptions: Subscription[] = [];
  purchaseList: PurchaseHistoryListModel[];
  selectedPurchase: PurchaseHistoryListModel;
  thisDeviceInfo: UsedDeviceInfoModel;
  imei: string;
  loadingBehaviorSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean> = this.loadingBehaviorSubject.asObservable();
  storedDeviceInfo: UsedStoredDeviceInfoModel;
  showThisDeviceInfo: boolean;
  isDevicesListEmpty: boolean;
  isSelfDeviceAvailable: boolean;
  isPurchaseListCalled: boolean;

  ngOnInit(): void {
    this.getStoredDeviceInfo();
    if (this.isFromNativeApp || this.isHybridApp) {
      this.subscribeToUserInfo();
      this.getThisDeviceInfo();
    }

    if (this.loginService.isLoggedIn) {
      this.subscribeToPurchaseList();
    }
    this.setHeaderData();
    this.subscribeToBackBtn();
  }

  subscribeToBackBtn(): void {
    const subscription = this.sharedService.getBackClick().subscribe({
      next: () => {
        if (this.isFromWebApp || this.isHybridApp) {
          if (this.isHybridApp) {
            this.ngxHybridServiceService.close();
          } else {
            window.location.href = window.location.origin;
          }
        } else {
          if (!this.deviceInfoService.getShowBrandPickerValue()) {
            this.deviceInfoService.setShowBrandPicker(true);
          }
          this.location.back();
        }
      }
    });

    this.subscriptions.push(subscription);
  }

  subscribeToUserInfo(): void {
    const subscription = this.sharedService.getUserInfo()
      .subscribe({
        next: (res) => {
          if (res?.cellNumber && this.loginService.isLoggedIn) {
            this.getDevicesList(ProductCategoryModel[2]);
          }
        },
        error: (e) => {
          this.messageService.showErrorIfExists(e);
        }
      });
    this.subscriptions.push(subscription);
  }

  getDevicesList(category: string): void {
    queueMicrotask(() => {
      const userInfo = this.sharedService.getUserInfoValue();
      this.usedApi.purchaseList({mobile: userInfo.cellNumber, category})
        .subscribe({
          next: (res) => {
            if (res.data?.length > 0) {
              this.purchaseList = res.data;
              this.deviceInfoService.setPurchaseList(res.data);
              this.loadingBehaviorSubject.next(false);
              this.isDevicesListEmpty = false;
            } else {
              this.isDevicesListEmpty = true;
            }
            this.isPurchaseListCalled = true;
            this.decideToLeave();
          },
          error: (e) => {
            this.isDevicesListEmpty = true;
            this.messageService.showErrorIfExists(e);
            this.isPurchaseListCalled = true;
            this.decideToLeave();
          }
        });
    });
  }

  subscribeToPurchaseList(): void {
    this.loadingBehaviorSubject.next(true);
    const subscription = this.deviceInfoService.getPurchaseList()
      .subscribe({
        next: (list) => {
          if (list.length > 0) {
            this.purchaseList = list;
            this.loadingBehaviorSubject.next(false);
          } else if (this.loginService.isLoggedIn) {
            this.getDevicesList(ProductCategoryModel[2]);
          }
        }
      });
    this.subscriptions.push(subscription);
  }

  getStoredDeviceInfo(): void {
    this.storedDeviceInfo = this.deviceInfoService.getStoredDeviceInfo();
    if (this.storedDeviceInfo) {
      this.selectedPurchase = {
        id: this.storedDeviceInfo.deviceId ? this.storedDeviceInfo.deviceId : null,
        serialNumber: this.storedDeviceInfo.serialNumber ? this.storedDeviceInfo.serialNumber : null,
        title: this.storedDeviceInfo.brandTitle ? this.storedDeviceInfo.brandTitle : null,
        productBrand: this.storedDeviceInfo.brandTitle ? this.storedDeviceInfo.brandTitle : null,
        productModel: this.storedDeviceInfo.modelTitle ? this.storedDeviceInfo.modelTitle : null,
        buyDate: null
      };
    }
  }

  /*
  * Get Device Info From Native App **/
  getThisDeviceInfo(): void {
    if (window.digipayHybridApp && typeof window.digipayHybridApp.getDeviceInfo === 'function') {
      window.digipayHybridApp.setDeviceInfo = (deviceInfo: string) => {
        try {
          this.thisDeviceInfo = JSON.parse(deviceInfo) as UsedDeviceInfoModel;
          this.showThisDeviceInfo = true;
          this.storedDeviceInfo = this.deviceInfoService.getStoredDeviceInfo();
          this.loadingBehaviorSubject.next(false);
        } catch (e) {
          this.showThisDeviceInfo = false;
        }
      };
      window.digipayHybridApp.getDeviceInfo();
      this.isSelfDeviceAvailable = true;
      return;
    } else if (window.DigipayJsInterface && typeof window.DigipayJsInterface.getDeviceInfo === 'function') {
      window.DigipayJsInterface.setDeviceInfo = (deviceInfo: string) => {
        try {
          this.thisDeviceInfo = JSON.parse(deviceInfo);
          this.showThisDeviceInfo = true;
          this.loadingBehaviorSubject.next(false);
        } catch (e) {
          this.showThisDeviceInfo = false;
        }
      };
      window.DigipayJsInterface.getDeviceInfo();
      this.isSelfDeviceAvailable = true;
    } else {
      this.isSelfDeviceAvailable = false;
    }
    this.decideToLeave();
  }

  decideToLeave(): void {
    if (this.isFromNativeApp || this.isHybridApp) {
      if (this.isPurchaseListCalled) {
        if (this.isDevicesListEmpty && !this.isSelfDeviceAvailable) {
          this.deviceInfoService.setShowDevicesList(false);
        }
      }
    }
  }

  handleDeviceClick(id: string): void {
    this.selectedPurchase = this.purchaseList
      .filter((purchase) => purchase.id === id)[0];
    this.deviceInfoService.setRegisterType(RegisterTypes.PurchaseHistoryList);
    this.saveToLocalStorage();
  }

  handleSelfDeviceClick(): void {
    this.selectedPurchase = {
      id: '0',
      buyDate: null,
      productBrand: this.thisDeviceInfo.brand,
      productModel: this.thisDeviceInfo.deviceModel,
      serialNumber: null,
      title: this.thisDeviceInfo.brand,
    };
    this.deviceInfoService.setRegisterType(RegisterTypes.SelfDevice);
    this.saveToLocalStorage();
  }

  saveToLocalStorage(): void {
    this.storedDeviceInfo = {
      deviceId: this.selectedPurchase.id,
      brandTitle: this.selectedPurchase.productBrand,
      brandId: null,
      modelTitle: this.selectedPurchase.productModel,
      modelId: null,
      serialNumber: this.selectedPurchase.serialNumber ? this.selectedPurchase.serialNumber : null
    };
    this.deviceInfoService.setStoredDeviceInfo(this.storedDeviceInfo);
  }

  handleOtherDevice(): void {
    this.intrackService.sendIntrackEvent('I_ODR');
    this.deviceInfoService.setStoredDeviceInfo({
      ...this.deviceInfoService.getStoredDeviceInfo(),
      brandId: null,
      brandTitle: null,
      modelId: null,
      modelTitle: null,
      serialNumber: null
    });
    this.deviceInfoService.setShowDevicesList(false);
  }

  setHeaderData(): void {
    this.sharedService.setHeaderData({
      showBackBtn: true,
      headerTitle: '',
      actionButtons: [
        {mode: UsedHeaderButtonModes.PROFILE}
      ]
    });
  }

  goToNextStep(): void {
    this.deviceSelected.emit(this.selectedPurchase);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s && s.unsubscribe());
  }
}
