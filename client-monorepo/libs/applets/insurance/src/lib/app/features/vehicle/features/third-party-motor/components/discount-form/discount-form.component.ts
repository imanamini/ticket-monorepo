import { Component, input, OnDestroy, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ThirdPartyMotorDirective } from '../../directives/third-party-motor.directive';
import { InsRadioButtonComponent } from '../../../../components/ins-radio-button/ins-radio-button.component';
import { InsRadioButtonItemModel } from '../../../../data-access/models/ins-radio-button-item.model';
import { FormControlItemModel } from '../../../../data-access/models/form-control-item.model';

@Component({
  selector: 'discount-form',
  standalone: true,
  imports: [
    InsRadioButtonComponent
  ],
  templateUrl: './discount-form.component.html',
  styleUrl: './discount-form.component.scss'
})
export class DiscountFormComponent extends ThirdPartyMotorDirective implements OnInit, OnDestroy {
  discountForm = input.required<FormGroup>();
  showError = input<boolean>(false);
  protected items = signal<InsRadioButtonItemModel[]>([
    {
      title: 'تخفیفی ندارم',
      value: 0
    },
    {
      title: 'با همین پلاک تخفیف دارم',
      value: 1
    }
  ]);

  private formControls: FormControlItemModel[] = [
    {
      name: 'discount',
      disabled: false,
      validators: []
    }
  ];

  ngOnInit(): void {
    this.setFormControls();
    this.getDataFromUrl();
  }

  getDataFromUrl(): void {
    super.addSubscription(this.storeService.getStoreDataAsObservable().subscribe({
      next: (value) => {
        const areDiscountsSelected = value.previousInsuranceDetail.thirdPartyDiscountId && value.previousInsuranceDetail.driverDiscount;
        this.discountForm()?.controls?.discount?.setValue(areDiscountsSelected ? (this.storeService.hasDiscount ? 1 : 0) : null);
      }
    }));
  }

  setFormControls(): void {
    this.formControls.forEach(item => {
      this.discountForm()?.setControl(item.name, new FormControl({
        value: null,
        disabled: item.disabled
      }, [Validators.required, ...item.validators]));
    });
  }

  handleValueChange(e: number | null): void {
    this.discountForm()?.controls.discount?.setValue(e);
  }

  protected onClose(): void {
  }

  protected onNext(route: string): void {
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.formControls.forEach(item => {
      this.discountForm()?.removeControl(item.name);
    });
  }
}
