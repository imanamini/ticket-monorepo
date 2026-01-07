import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { UsedApiService } from '../../../../../../api/services/used/used-api.service';
import { UsedDeviceInfoService } from '../../services/used-device-info.service';
import { SharedUsedService } from '../../../../services/shared-used.service';
import { MessageService } from '@client-monorepo/common/utilities';
import { LoadingService } from '../../../../../../../../data-access/services/loading.service';
import { UsedStoredDeviceInfoModel } from '../../models/used-stored-device-info.model';
import { UsedHeaderButtonModes } from '../../../../partials/used-header/models/used-header-button.modes';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { UsedBrandModel404Component } from '../used-brand-model-404/used-brand-model-404.component';
import { JourneyButtonsComponent } from '../../../../../../partials/journey-buttons/journey-buttons.component';
import { UsedSelectedBrandModelComponent } from '../used-selected-brand-model/used-selected-brand-model.component';
import { UsedProductBrandCardComponent } from '../used-product-brand-card/used-product-brand-card.component';
import {
  UiLoadingSpinnerComponent
} from '../../../../../../../../components/ui-loading-spinner/ui-loading-spinner.component';
import { BrandModel } from '../../../../../../api/models/used/brand.model';
import { ProductCategoryModel } from '../../../../../../api/models/policy/product-category.model';
import { Router } from '@angular/router';
import { IntrackService } from '../../../../../../../../data-access/services/intrack.service';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'used-brand-picker',
  templateUrl: './used-brand-picker.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    UiFormFieldBuilderModule,
    UsedBrandModel404Component,
    JourneyButtonsComponent,
    UsedSelectedBrandModelComponent,
    UsedProductBrandCardComponent,
    UiLoadingSpinnerComponent,
    NgxIcon
  ],
  styleUrls: ['./used-brand-picker.component.scss']
})
export class UsedBrandPickerComponent implements OnInit, OnDestroy {

  @Output()
  brandSelected = new EventEmitter<BrandModel>();
  subscriptions: Subscription[] = [];
  selectedBrand: BrandModel;
  brands: BrandModel[];
  isFromNativeApp = this.sharedService.getIsUserFromNativeAppValue();
  isFromWebApp: boolean = this.sharedService.getIsUserFromWebAppValue();
  selectedCategory = ProductCategoryModel.MOBILE;
  form: UntypedFormGroup = this.fb.group({
    phrase: ['', [
      Validators.minLength(2)
    ]]
  });
  loading$: Observable<boolean> = this.loadingService.getLoading();
  showNotFound: boolean;
  storedDeviceInfo: UsedStoredDeviceInfoModel;
  uniqueCode: string;
  showSelectedBrand: boolean;
  isBrandsLoading: boolean;

  constructor(private fb: UntypedFormBuilder,
              private usedApi: UsedApiService,
              private deviceInfoService: UsedDeviceInfoService,
              private sharedService: SharedUsedService,
              private messageService: MessageService,
              private loadingService: LoadingService,
              private intrackService: IntrackService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.getStoredDeviceInfo();
    this.handlePhraseInput();
    this.setHeaderData();
    this.searchBrands('');
  }

  searchBrands(query: string): void {
    this.isBrandsLoading = true;
    const subscription = this.usedApi.searchBrands(query, ProductCategoryModel[this.selectedCategory])
      .subscribe({
        next: (res) => {
          this.isBrandsLoading = false;
          this.brands = res.data;
          this.showNotFound = res.data.length <= 0;
        }, error: (e) => {
          this.messageService.showErrorIfExists(e);
        }
      });
    this.subscriptions.push(subscription);
  }

  handlePhraseInput(): void {
    const subscription = this.form.get('phrase').valueChanges
      .pipe(debounceTime(300))
      .subscribe({
        next: (phrase: string) => {
          if (phrase?.length > 1 || phrase === '') {
            this.searchBrands(phrase);
          }
        }
      });
    this.subscriptions.push(subscription);
  }

  getStoredDeviceInfo(): void {
    this.storedDeviceInfo = this.deviceInfoService.getStoredDeviceInfo();
    if (this.storedDeviceInfo?.brandTitle) {
      this.handlePreSelection();
    } else {
      this.showSelectedBrand = false;
    }
  }

  handlePreSelection(): void {
    this.selectedBrand = {
      ...this.selectedBrand,
      title: this.storedDeviceInfo.brandTitle,
      id: this.storedDeviceInfo.brandId ? this.storedDeviceInfo.brandId : null
    };
    this.showSelectedBrand = true;
  }

  handleBrandSelect(id: string): void {
    if (this.selectedBrand?.id !== id) {
      if (this.storedDeviceInfo?.modelTitle) {
        delete this.storedDeviceInfo.modelTitle;
      } else if (this.storedDeviceInfo?.modelId) {
        delete this.storedDeviceInfo.modelId;
      }
    }
    this.selectedBrand = this.brands.find(item => item.id === id);
    this.deviceInfoService.setStoredDeviceInfo({
      ...this.storedDeviceInfo,
      brandId: this.selectedBrand.id,
      brandTitle: this.selectedBrand.title
    });
  }

  confirm(): void {
    this.intrackService.sendIntrackEvent('I_DBS', {
      DeviceBrand: this.selectedBrand.title ?? ''
    });
    this.brandSelected.emit(this.selectedBrand);
  }

  setHeaderData(): void {
    this.sharedService.setHeaderData({
      showBackBtn: true,
      headerTitle: 'انتخاب برند',
      actionButtons: [
        {mode: UsedHeaderButtonModes.PROFILE}
      ]
    });
  }

  scrollToTop(): void {
    window.scrollTo(0, 0);
  }

  handleButtonClick(): void {
    this.deviceInfoService.setStoredDeviceInfo({
      ...this.deviceInfoService.getStoredDeviceInfo(),
      brandId: null,
      modelId: null,
    });
    this.deviceInfoService.setShowCustomBrandModel(true);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s && s.unsubscribe());
  }
}
