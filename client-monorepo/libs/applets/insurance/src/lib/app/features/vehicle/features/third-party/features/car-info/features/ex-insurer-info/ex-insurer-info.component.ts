import { Component, ElementRef, inject, OnInit } from '@angular/core';
import { CarInfoBoxComponent } from '../../../../components/car-info-box/car-info-box.component';
import { ClaimDetailFormComponent } from '../../../../components/claim-detail-form/claim-detail-form.component';
import { ClaimFormComponent } from '../../../../components/claim-form/claim-form.component';
import {
  DiscountDetailFormComponent
} from '../../../../components/discount-detail-form/discount-detail-form.component';
import { DiscountFormComponent } from '../../../../components/discount-form/discount-form.component';
import {
  OwnershipChangedFormComponent
} from '../../../../components/ownership-changed-form/ownership-changed-form.component';
import { IconEnum } from '../../../../../../../../data-access/enums/icon.enum';
import { FormValidatorsService } from '../../../../data-access/services/form-validators.service';
import { MessageService } from '@client-monorepo/common/utilities';
import { UntypedFormBuilder } from '@angular/forms';
import {
  ApplicationFormApiService
} from '../../../../../../data-access/services/third-party/application-form-api.service';
import { StoreService } from '../../../../data-access/services/store.service';
import { PlateService } from '../../../../data-access/services/plate.service';
import { BaseComponent } from '../../../../../../../../components/base/base.component';
import { ThirdPartyUrlsEnum } from '../../../../data-access/enums/third-party-urls.enum';
import { VehicleSharedService } from '../../../../../../data-access/services/vehicle-shared.service';
import { ConstantAllService } from '../../../../../../data-access/services/shared/constant-all.service';
import { InsuranceProductTypeEnum } from '../../../../../../../../data-access/enums/Insurance-product-type.enum';

@Component({
  selector: 'ex-insurer-info',
  standalone: true,
  imports: [
    CarInfoBoxComponent,
    ClaimDetailFormComponent,
    ClaimFormComponent,
    DiscountDetailFormComponent,
    DiscountFormComponent,
    OwnershipChangedFormComponent
  ],
  templateUrl: './ex-insurer-info.component.html',
  styleUrl: './ex-insurer-info.component.scss'
})
export class ExInsurerInfoComponent extends BaseComponent implements OnInit {

  private formValidator = inject(FormValidatorsService);
  private elementRef = inject(ElementRef<HTMLElement>);
  private messageService = inject(MessageService);
  private fb = inject(UntypedFormBuilder);
  private sharedService = inject(VehicleSharedService);
  private storeService = inject(StoreService);
  private plateService = inject(PlateService);
  private appFieldApiService = inject(ApplicationFormApiService);
  private constantAllService = inject(ConstantAllService);

  plate: string | null = null;
  showError = false;
  protected readonly IconEnum = IconEnum;
  ownershipChangedForm = this.fb.group({});
  discountForm = this.fb.group({});
  discountDetailForm = this.fb.group({});
  claimForm = this.fb.group({});
  claimDetailForm = this.fb.group({});

  ngOnInit(): void {
    this.subscribeOnFormsChange();
    this.getPlate();
    this.storeService.loadUnauthorizedApplicationData();
  }

  subscribeOnFormsChange(): void {
    super.addSubscription(this.ownershipChangedForm?.valueChanges.subscribe({
      next: value => {
        this.discountForm.controls.ownershipChanged?.setValue(value.ownershipChanged === 0 ? 1 : null);
      }
    }));

    super.addSubscription(this.discountForm?.valueChanges.subscribe({
      next: value => {
        if (value.discount === 0) {
          this.discountDetailForm?.controls.thirdPartyDiscount?.setValue(null);
          this.discountDetailForm?.controls.driverDiscount?.setValue(null);
        }
      }
    }));

    super.addSubscription(this.claimForm?.valueChanges.subscribe({
      next: value => {
        if (value.claim === 0) {
          this.claimDetailForm?.controls.propertyDamage?.setValue(null);
          this.claimDetailForm?.controls.driverDamage?.setValue(null);
          this.claimDetailForm?.controls.healthDamage?.setValue(null);
        }
      }
    }));
  }

  handleDeActiveButtonClicked(): void {
    this.location.back();
  }

  handleActiveButtonClicked(): void {
    if (this.ownershipChangedForm.invalid
      || this.discountForm.invalid
      || ((this.ownershipChangedForm.controls.ownershipChanged?.value === 0
        || this.discountForm?.controls.discount?.value === 1) && this.discountDetailForm.invalid)
      || this.claimForm.invalid
      || (this.claimForm.controls.claim?.value === 1 && this.claimDetailForm.invalid)) {
      this.showError = true;

      if (this.ownershipChangedForm.invalid) {
        this.messageService.showErrorMessage('کاربر گرامی، لطفاً تغییر مالکیت را وارد کنید.', 'vehicle-message');
        return;
      }

      if (this.discountForm.invalid) {
        this.messageService.showErrorMessage('کاربر گرامی، لطفاً تخفیف را وارد کنید.', 'vehicle-message');
        return;
      }

      if (this.claimForm.invalid) {
        this.messageService.showErrorMessage('کاربر گرامی، لطفاً خسارت را وارد کنید.', 'vehicle-message');
        return;
      }

      setTimeout(() => {
        if (this.discountDetailForm.invalid) {
          this.scrollToElement('discount-detail');
          return;
        }

        if (this.claimDetailForm.invalid) {
          this.scrollToElement('claim-detail');
          return;
        }
      }, 0);

      return;
    }

    if (!this.formValidator.claimDetailValidator(this.claimDetailForm)) {
      setTimeout(() => {
        this.scrollToElement('claim-detail');
      }, 0);
      this.messageService.showErrorMessage('کاربر گرامی، همه گزینه‌ها نمی‌تواند فاقد خسارت باشد.', 'vehicle-message');
      return;
    }

    const discount = this.ownershipChangedForm?.controls.ownershipChanged?.value === 0 ? 1
      : this.discountForm?.controls.discount?.value;

    const claim = this.claimForm?.controls?.claim?.value;

    super.addSubscription(this.appFieldApiService.putApplicationForm({
      applicationFormId: this.storeService.getFormId(),
      ...this.storeService.getStoreValueAsPutRequest(),
      vehicleInfo: {
        ...this.storeService.getStoreValueAsPutRequest().vehicleInfo,
        vehicleOwnerChanged: !!this.ownershipChangedForm?.value?.ownershipChanged
      },
      previousInsuranceDetail: {
        ...this.storeService.getStoreValueAsPutRequest().previousInsuranceDetail,
        driverDiscountId: discount ? this.discountDetailForm?.controls?.driverDiscount?.value
          : this.constantAllService.driverDiscountDefaultValue(),
        driverDamageId: claim ? this.claimDetailForm?.controls?.driverDamage?.value : this.constantAllService.driverDamageDefaultValue(),
        healthDamageId: claim ? this.claimDetailForm?.controls?.healthDamage?.value : this.constantAllService.healthDamageDefaultValue(),
        propertyDamageId: claim ? this.claimDetailForm?.controls?.propertyDamage?.value
          : this.constantAllService.propertyDamageDefaultValue(),
        thirdPartyDiscountId: discount ? this.discountDetailForm?.controls?.thirdPartyDiscount?.value
          : this.constantAllService.thirdPartyDiscountDefaultValue()
      }
    }).subscribe(
      {
        next: res => {
          this.storeService.setStoreData(res.result);
          this.sharedService.navigate(ThirdPartyUrlsEnum.PriceCardList, null, InsuranceProductTypeEnum.ThirdParty);
        }
      }
    ));
  }

  getPlate(): void {
    super.addSubscription(this.plateService.getPlate().subscribe({
      next: res => {
        this.plate = res ?? null;
      }
    }));
  }

  scrollToElement(className: string): void {
    this.elementRef.nativeElement.getElementsByClassName(className)[0]?.scrollIntoView({
      behavior: 'smooth'
    });
  }
}
