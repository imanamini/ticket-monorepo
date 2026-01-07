import { Component, ElementRef, inject, OnInit, signal } from '@angular/core';
import { MotorInfoBoxComponent } from '../../components/motor-info-box/motor-info-box.component';
import { ClaimDetailFormComponent } from '../../components/claim-detail-form/claim-detail-form.component';
import { ClaimFormComponent } from '../../components/claim-form/claim-form.component';
import {
  DiscountDetailFormComponent
} from '../../components/discount-detail-form/discount-detail-form.component';
import { DiscountFormComponent } from '../../components/discount-form/discount-form.component';
import {
  OwnershipChangedFormComponent
} from '../../components/ownership-changed-form/ownership-changed-form.component';
import { IconEnum } from '../../../../../../data-access/enums/icon.enum';
import { FormValidatorsService } from '../../../third-party/data-access/services/form-validators.service';
import { UntypedFormBuilder } from '@angular/forms';
import { ThirdPartyMotorDirective } from '../../directives/third-party-motor.directive';
import { THIRD_PARTY_MOTOR_ROUTE } from '../../data-access/constants/third-party-motor-route.const';
import { ThirdPartyMotorKeysEnum } from '../../data-access/enums/third-party-motor-keys.enum';
import { ApplicationFormMotorPutRequestModel } from '../../data-access/models/application-form-motor-put-request.model';

@Component({
  selector: 'ex-insurer-motor-info',
  standalone: true,
  imports: [
    MotorInfoBoxComponent,
    ClaimDetailFormComponent,
    ClaimFormComponent,
    DiscountDetailFormComponent,
    DiscountFormComponent,
    OwnershipChangedFormComponent
  ],
  templateUrl: './ex-insurer-motor-info.component.html',
  styleUrl: './ex-insurer-motor-info.component.scss'
})
export class ExInsurerMotorInfoComponent extends ThirdPartyMotorDirective implements OnInit {

  private formValidator = inject(FormValidatorsService);
  private elementRef = inject(ElementRef<HTMLElement>);
  private fb = inject(UntypedFormBuilder);

  protected readonly IconEnum = IconEnum;

  showError = signal(false);
  ownershipChangedForm = signal(this.fb.group({}));
  discountForm = signal(this.fb.group({}));
  discountDetailForm = signal(this.fb.group({}));
  claimForm = signal(this.fb.group({}));
  claimDetailForm = signal(this.fb.group({}));

  ngOnInit(): void {
    this.subscribeOnFormsChange();
  }

  private subscribeOnFormsChange(): void {
    super.addSubscription(this.ownershipChangedForm().valueChanges.subscribe({
      next: value => {
        this.discountForm().controls.ownershipChanged?.setValue(value.ownershipChanged === 0 ? 1 : null);
      }
    }));

    super.addSubscription(this.discountForm().valueChanges.subscribe({
      next: value => {
        if (value.discount === 0) {
          this.discountDetailForm().controls.thirdPartyDiscount?.setValue(null);
          this.discountDetailForm().controls.driverDiscount?.setValue(null);
        }
      }
    }));

    super.addSubscription(this.claimForm().valueChanges.subscribe({
      next: value => {
        if (value.claim === 0) {
          this.claimDetailForm().controls.propertyDamage?.setValue(null);
          this.claimDetailForm().controls.driverDamage?.setValue(null);
          this.claimDetailForm().controls.healthDamage?.setValue(null);
        }
      }
    }));
  }

  public handleDeActiveButtonClicked(): void {
    this.location.back();
  }

  public handleActiveButtonClicked(): void {
    if (this.ownershipChangedForm().invalid
      || this.discountForm().invalid
      || ((this.ownershipChangedForm().controls.ownershipChanged?.value === 0
        || this.discountForm().controls.discount?.value === 1) && this.discountDetailForm().invalid)
      || this.claimForm().invalid
      || (this.claimForm().controls.claim?.value === 1 && this.claimDetailForm().invalid)) {
      this.showError.set(true);

      if (this.ownershipChangedForm().invalid) {
        this.messageService.showErrorMessage('کاربر گرامی، لطفاً تغییر مالکیت را وارد کنید.', 'vehicle-message');
        return;
      }

      if (this.discountForm().invalid) {
        this.messageService.showErrorMessage('کاربر گرامی، لطفاً تخفیف را وارد کنید.', 'vehicle-message');
        return;
      }

      if (this.claimForm().invalid) {
        this.messageService.showErrorMessage('کاربر گرامی، لطفاً خسارت را وارد کنید.', 'vehicle-message');
        return;
      }

      setTimeout(() => {
        if (this.discountDetailForm().invalid) {
          this.scrollToElement('discount-detail');
          return;
        }

        if (this.claimDetailForm().invalid) {
          this.scrollToElement('claim-detail');
          return;
        }
      }, 0);

      return;
    }

    if (!this.formValidator.claimDetailValidator(this.claimDetailForm())) {
      setTimeout(() => {
        this.scrollToElement('claim-detail');
      }, 0);
      this.messageService.showErrorMessage('کاربر گرامی، همه گزینه‌ها نمی‌تواند فاقد خسارت باشد.', 'vehicle-message');
      return;
    }

    const discount = this.ownershipChangedForm().controls.ownershipChanged?.value === 0 ? 1
      : this.discountForm().controls.discount?.value;

    const claim = this.claimForm().controls?.claim?.value;
    const model: ApplicationFormMotorPutRequestModel = this.storeService.getStoreValueAsPutRequest();
    if (model) {
      model.vehicleInfo.vehicleOwnerChanged = !!this.ownershipChangedForm().controls.ownershipChanged?.value;
      model.previousInsuranceDetail.driverDiscountId = discount ? this.discountDetailForm().controls.driverDiscount?.value
        : this.constantAllService.driverDiscountDefaultValue();
      model.previousInsuranceDetail.thirdPartyDiscountId = discount ? this.discountDetailForm().controls.thirdPartyDiscount?.value
        : this.constantAllService.thirdPartyDiscountDefaultValue();
      model.previousInsuranceDetail.driverDamageId = claim ? this.claimDetailForm().controls.driverDamage?.value
        : this.constantAllService.driverDamageDefaultValue();
      model.previousInsuranceDetail.healthDamageId = claim ? this.claimDetailForm().controls.healthDamage?.value
        : this.constantAllService.healthDamageDefaultValue();
      model.previousInsuranceDetail.propertyDamageId = claim ? this.claimDetailForm().controls.propertyDamage?.value
        : this.constantAllService.propertyDamageDefaultValue();
    }

    super.addSubscription(this.motorApiService.putApplicationForm(model).subscribe(
      {
        next: res => {
          this.storeService.setStoreData(res.result);
          this.onNext(THIRD_PARTY_MOTOR_ROUTE.PriceCardList);
        }
      }
    ));
  }

  private scrollToElement(className: string): void {
    this.elementRef.nativeElement.getElementsByClassName(className)[0]?.scrollIntoView({
      behavior: 'smooth'
    });
  }

  protected onNext(route: string): void {
    this.router.navigate([route], {
      relativeTo: this.activatedRoute.parent,
      queryParamsHandling: 'merge'
    }).then();
  }

  protected onClose(): void {
    this.closeService.close();
  }
}
