import { Component, EventEmitter, Input, OnDestroy, OnInit, output, Output } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { UsedApiService } from '../../../../../../api/services/used/used-api.service';
import { SharedUsedService } from '../../../../services/shared-used.service';
import { UsedDeviceInfoService } from '../../services/used-device-info.service';
import { LoadingService } from '../../../../../../../../data-access/services/loading.service';
import { UsedStoredDeviceInfoModel } from '../../models/used-stored-device-info.model';
import { RegisterTypes } from '../../models/used-register-types.model';
import { UsedHeaderButtonModes } from '../../../../partials/used-header/models/used-header-button.modes';
import { AsyncPipe } from '@angular/common';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { UsedBrandModel404Component } from '../used-brand-model-404/used-brand-model-404.component';
import { JourneyButtonsComponent } from '../../../../../../partials/journey-buttons/journey-buttons.component';
import { UsedSelectedBrandModelComponent } from '../used-selected-brand-model/used-selected-brand-model.component';
import { UsedProductModelCardComponent } from '../used-product-model-card/used-product-model-card.component';
import {
  UiLoadingSpinnerComponent
} from '../../../../../../../../components/ui-loading-spinner/ui-loading-spinner.component';
import { BrandModel } from '../../../../../../api/models/used/brand.model';
import { IntrackService } from '../../../../../../../../data-access/services/intrack.service';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'used-model-picker',
  templateUrl: './used-model-picker.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    UiFormFieldBuilderModule,
    UsedBrandModel404Component,
    JourneyButtonsComponent,
    UsedSelectedBrandModelComponent,
    UsedProductModelCardComponent,
    UiLoadingSpinnerComponent,
    NgxIcon
  ],
  styleUrls: ['./used-model-picker.component.scss']
})
export class UsedModelPickerComponent implements OnInit, OnDestroy {

  @Input()
  selectedBrand: BrandModel;
  @Output()
  modelSelected = new EventEmitter<BrandModel>();
  selectedModel: BrandModel;
  subscriptions: Subscription[] = [];
  models: BrandModel[];
  form: UntypedFormGroup = this.fb.group({
    phrase: ['', [
      Validators.minLength(2)
    ]]
  });
  loading$: Observable<boolean> = this.loadingService.getLoading();
  showNotFound: boolean;
  storedDeviceInfo: UsedStoredDeviceInfoModel;
  uniqueCode: string;
  showSelectedModel: boolean;

  constructor(private fb: UntypedFormBuilder,
              private usedApi: UsedApiService,
              private sharedService: SharedUsedService,
              private intrackService: IntrackService,
              private deviceInfoService: UsedDeviceInfoService,
              private loadingService: LoadingService) {
  }

  ngOnInit(): void {
    this.handlePhraseInput();
    this.setHeaderData();
    this.getStoredDeviceInfo();
    this.searchModels('');
  }

  handlePhraseInput(): void {
    const subscription = this.form.get('phrase').valueChanges
      .pipe(debounceTime(300))
      .subscribe({
        next: (phrase: string) => {
          if (phrase?.length > 1 || phrase === '') {
            this.searchModels(phrase);
          }
        }
      });
    this.subscriptions.push(subscription);
  }

  searchModels(phrase: string): void {
    if (this.selectedBrand && this.selectedBrand.id) {
      const subscription = this.usedApi.searchModels(this.selectedBrand.id, phrase)
        .subscribe({
          next: (res) => {
            this.models = res.data;
            this.showNotFound = res.data.length <= 0;
          }
        });
      this.subscriptions.push(subscription);
    }
  }

  getStoredDeviceInfo(): void {
    this.storedDeviceInfo = this.deviceInfoService.getStoredDeviceInfo();
    if (!this.selectedBrand && this.storedDeviceInfo?.brandTitle) {
      this.selectedBrand = {
        ...this.selectedBrand,
        id: this.storedDeviceInfo.brandId ? this.storedDeviceInfo.brandId : null,
        title: this.storedDeviceInfo.brandTitle
      };
    }
    if (this.storedDeviceInfo?.modelTitle) {
      this.handlePreSelection();
    } else {
      this.showSelectedModel = false;
    }
  }

  handlePreSelection(): void {
    this.selectedModel = {
      ...this.selectedModel,
      title: this.storedDeviceInfo.modelTitle,
      englishTitle: this.storedDeviceInfo.modelTitle,
      id: this.storedDeviceInfo.modelId
    };
    this.showSelectedModel = true;
  }

  handleModelSelect(id: string): void {
    this.selectedModel = this.models.find((model) => model.id === id);
    this.deviceInfoService.setStoredDeviceInfo({
      ...this.storedDeviceInfo,
      modelTitle: this.selectedModel.englishTitle,
      modelId: this.selectedModel.id
    });
  }

  confirm(): void {
    this.intrackService.sendIntrackEvent('I_DMS', {
      DeviceBrand: this.selectedBrand.title ?? '',
      DeviceModel: this.selectedModel.englishTitle ?? ''
    });

    this.deviceInfoService.setRegisterType(RegisterTypes.BrandModelList);
    this.modelSelected.emit(this.selectedModel);
  }

  setHeaderData(): void {
    this.sharedService.setHeaderData({
      showBackBtn: true,
      headerTitle: 'انتخاب مدل',
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
      modelTitle: null,
      brandId: null,
      modelId: null,
    });
    this.deviceInfoService.setShowCustomBrandModel(true);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s && s.unsubscribe());
  }
}
