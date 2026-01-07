import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { LoadingService } from '../../../../../../data-access/services/loading.service';
import { LoggedInUser } from '../../../../../../data-access/models/logged-in-user.model';
import { UsedDeviceInfoService } from './services/used-device-info.service';
import { UsedApiService } from '../../../../api/services/used/used-api.service';
import { SharedJourneyApiService } from '../../../../shared-steps/services/shared-journey-api.service';
import { UsedStoredDeviceInfoModel } from './models/used-stored-device-info.model';
import { RegisterTypes } from './models/used-register-types.model';
import { SharedUsedService } from '../../services/shared-used.service';
import { AsyncPipe } from '@angular/common';
import { UiLoadingSpinnerComponent } from '../../../../../../components/ui-loading-spinner/ui-loading-spinner.component';
import { ProductCategoryModel } from '../../../../api/models/policy/product-category.model';
import { OrderModel } from '../../../../api/models/renewal/order.model';
import { BrandModel } from '../../../../api/models/used/brand.model';
import { PurchaseHistoryListModel } from '../../../../api/models/used/purchase-history-list.model';
import { RegisterBodyModel } from '../../../../api/models/used/register-body.model';
import { IntrackService } from '../../../../../../data-access/services/intrack.service';
import { LoginService } from '../../../../../../data-access/services/user-services/login.service';
import { isDesktop, isMobileOrTablet, MessageService } from '@client-monorepo/common/utilities';

@Component({
  selector: 'used-device-info',
  templateUrl: './used-device-info.component.html',
  standalone: true,
  imports: [AsyncPipe, UiLoadingSpinnerComponent],
  styleUrls: ['./used-device-info.component.scss'],
})
export class UsedDeviceInfoComponent implements OnInit, OnDestroy {
  private formBuilder = inject(UntypedFormBuilder);
  private sharedService = inject(SharedUsedService);
  private intrackService = inject(IntrackService);
  private deviceInfoService = inject(UsedDeviceInfoService);
  private usedApi = inject(UsedApiService);
  private sharedApiService = inject(SharedJourneyApiService);
  private route = inject(ActivatedRoute);
  private messageService = inject(MessageService);
  private loadingService = inject(LoadingService);
  private loginService = inject(LoginService);

  // Subscriptions
  subscriptions: Subscription[] = [];
  // Vars
  valueLength = 11;
  form = this.formBuilder.group({
    category: ['', [Validators.required]],
    mobile: [
      '',
      [
        Validators.required,
        Validators.pattern('^(?:09|۰۹)(?:[۰-۹0-9]){9}$'),
        Validators.minLength(this.valueLength),
        Validators.maxLength(this.valueLength),
      ],
    ],
  });
  selectedCategory: ProductCategoryModel = ProductCategoryModel.MOBILE;
  isMobile = isMobileOrTablet() || !isDesktop();
  userInfo: LoggedInUser;
  utmSource: string;
  accessToken: string;
  selectedBrandTitle: string;
  selectedBrandId: string;
  selectedModelTitle: string;
  selectedModelId: string;
  selectedSerial: string;
  userId: string;
  showDeviceList$: Observable<boolean> = this.deviceInfoService.getShowDevicesList();
  loading$: Observable<boolean>;
  userInfo$: Observable<LoggedInUser> = this.sharedService.getUserInfo();
  uniqueCode: string;
  orderInfo: OrderModel;

  ngOnInit(): void {
    this.selectedBrandTitle = 'گوشی';
    this.selectedModelTitle = 'هوشمند';
    this.register();
    // this.sharedApiService.setJourney(JourneyNamesModel.USED_DEVICE);
    // if (this.loginService.isLoggedIn) {
    //   this.subscribeToUserInfo();
    // } else {
    //   this.loginService.isLoggedIn$.subscribe((res) => {
    //     if (res) {
    //       this.subscribeToUserInfo();
    //     }
    //   });
    // }
    // this.getUrlParams();
  }

  getUrlParams(): void {
    const params = this.route.snapshot.queryParams;
    const hasCode = !!params.code;
    if (hasCode) {
      this.uniqueCode = params.code;
      this.getOrderInfo();
    }
    if (params.utm_source) {
      this.utmSource = params.utm_source;
    }
  }

  getOrderInfo(): void {
    const subscription = this.sharedApiService.getOrderInfo(this.uniqueCode).subscribe({
      next: (res) => {
        this.orderInfo = res.data;
        this.syncServerAndLocalStorage();
      },
      error: (err) => {
        this.messageService.showErrorIfExists(err);
      },
    });
    this.subscriptions.push(subscription);
  }

  syncServerAndLocalStorage(): void {
    this.deviceInfoService.setRegisterType(this.orderInfo.registerType);
    const registerType = this.orderInfo.registerType;
    let brandId: string;
    let modelId: string;

    if (registerType === RegisterTypes.CustomBrandModel || registerType === RegisterTypes.SelfDevice) {
      brandId = null;
      modelId = null;
    } else if (registerType === RegisterTypes.BrandModelList || registerType === RegisterTypes.PurchaseHistoryList) {
      brandId = this.orderInfo.productBrandId ? this.orderInfo.productBrandId : null;
      modelId = this.orderInfo.productModelId ? this.orderInfo.productModelId : null;
    }

    const newDeviceInfo: UsedStoredDeviceInfoModel = {
      brandId,
      modelId,
      brandTitle: this.orderInfo.productBrand ? this.orderInfo.productBrand : null,
      modelTitle: this.orderInfo.productModel ? this.orderInfo.productModel : null,
      phoneNumber: this.orderInfo.mobile ? this.orderInfo.mobile : null,
      serialNumber: this.orderInfo.serialNumber ? this.orderInfo.serialNumber : null,
    };
    this.selectedModelTitle = this.orderInfo.productModel ? this.orderInfo.productModel : null;
    this.sharedService.setUserInfo({
      ...this.userInfo,
      cellNumber: this.orderInfo.mobile ? this.orderInfo.mobile : null,
    });
    this.deviceInfoService.setStoredDeviceInfo(newDeviceInfo);
    this.decideWhereToGo();
  }

  decideWhereToGo(): void {
    const registerType = this.deviceInfoService.getRegisterTypeValue();
    switch (registerType) {
      case RegisterTypes.BrandModelList:
        this.deviceInfoService.setShowCustomBrandModel(false);
        this.deviceInfoService.setShowBrandPicker(true);
        this.deviceInfoService.setShowDevicesList(false);
        break;
      case RegisterTypes.PurchaseHistoryList:
        this.deviceInfoService.setShowDevicesList(true);
        break;
      case RegisterTypes.SelfDevice:
        this.deviceInfoService.setShowDevicesList(true);
        break;
      case RegisterTypes.CustomBrandModel:
        this.deviceInfoService.setShowDevicesList(false);
        break;
    }
  }

  subscribeToUserInfo(): void {
    setTimeout(() => {
      const subscription = this.sharedService.getUserInfo().subscribe({
        next: (info) => {
          if (info) {
            this.userInfo = info;
            if (this.userInfo) {
              this.deviceInfoService.setStoredDeviceInfo({
                ...this.deviceInfoService.getStoredDeviceInfo(),
                phoneNumber: this.userInfo.cellNumber,
              });
              this.getDevicesList(ProductCategoryModel[2]);
            }
          }
        },
      });

      this.subscriptions.push(subscription);
    }, 500);
  }

  getDevicesList(category: string): void {
    queueMicrotask(() => {
      this.loadingService.setLoading(true);
      const userInfo = this.sharedService.getUserInfoValue();
      const subscription = this.usedApi.purchaseList({ mobile: userInfo.cellNumber, category }).subscribe({
        next: (res) => {
          const showDevicesList = res.data.length > 0;
          this.deviceInfoService.setPurchaseList(res.data);
          this.deviceInfoService.setShowDevicesList(showDevicesList);
          this.loadingService.setLoading(false);
        },
        error: (e) => {
          this.messageService.showErrorIfExists(e);
          this.loadingService.setLoading(false);
        },
      });
      this.subscriptions.push(subscription);
    });
  }

  handleBrandModelCompletion(event: { brand: BrandModel; model: BrandModel }): void {
    this.selectedBrandTitle = event.brand.title;
    this.selectedBrandId = event.brand.id;
    this.selectedModelTitle = event.model.englishTitle;
    this.selectedModelId = event.model.id;
    this.register();
  }

  handleDeviceSelect(event: PurchaseHistoryListModel): void {
    if (event) {
      this.selectedBrandTitle = event.productBrand ? event.productBrand : null;
      this.selectedModelTitle = event.productModel ? event.productModel : null;
      this.selectedSerial = event.serialNumber ? event.serialNumber : null;
      this.register();
    }
  }

  register(): void {
    this.loadingService.setLoading(true);
    const body: RegisterBodyModel = {
      category: ProductCategoryModel[this.selectedCategory],
      brand: this.selectedBrandTitle,
      model: this.selectedModelTitle,
      serial: this.selectedSerial ? this.selectedSerial : null,
      productModelId: this.selectedModelId ? this.selectedModelId : null,
      productBrandId: this.selectedBrandId ? this.selectedBrandId : null,
      utmSource: this.utmSource ? this.utmSource : null,
      registerType: this.deviceInfoService.getRegisterTypeValue(),
    };
    const subscription = this.usedApi.register(body).subscribe({
      next: (res) => {
        this.sharedService.setUniqueCode(res.data);
        this.deviceInfoService.purgeStoredDeviceInfo();
        this.intrackService.sendIntrackEvent('I_RR', {
          PurchaseTime: null,
          DeviceModel: this.selectedModelTitle ?? '',
          uniquecode: res.data ?? '',
          State: 'SUCCESS',
        });
        this.sharedService.setStepChangeSubject('NEXT');
      },
      error: (e) => {
        this.loadingService.setLoading(false);
        this.intrackService.sendIntrackEvent('I_RR', {
          PurchaseTime: null,
          DeviceModel: this.selectedModelTitle,
          State: 'FAILED',
          uniquecode: '',
          ErrorMessage: e.message,
        });
        this.messageService.showErrorIfExists(e);
      },
    });
    this.subscriptions.push(subscription);
  }

  ngOnDestroy(): void {
    this.loadingService.setLoading(false);
    this.subscriptions.forEach((s) => s && s.unsubscribe());
  }
}
