import { AfterViewInit, Component, computed, inject, input, model, OnInit, signal } from '@angular/core';
import { FormFieldOption } from '@digipay/ui-form-field-builder/lib/models/form-field-option.interface';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { DeviceDetector } from '@digipay/layout';
import { ThirdPartyMotorDirective } from '../../directives/third-party-motor.directive';
import { FormControlItemModel } from '../../../../data-access/models/form-control-item.model';
import { CarDataModel } from '../../../../data-access/models/third-party/constant-all/car-data.model';

@Component({
  selector: 'discount-detail-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    UiFormFieldBuilderModule
  ],
  templateUrl: './discount-detail-form.component.html',
  styleUrl: './discount-detail-form.component.scss'
})
export class DiscountDetailFormComponent extends ThirdPartyMotorDirective implements OnInit, AfterViewInit {
  private deviceDetector = inject(DeviceDetector);

  public discountForm = input.required<FormGroup>();
  public showError = model<boolean>(false);

  protected thirdPartyDiscounts = signal<FormFieldOption[]>([]);
  protected driverDiscounts = signal<FormFieldOption[]>([]);

  private formControls: FormControlItemModel[] = [
    {
      name: 'thirdPartyDiscount',
      disabled: false,
      validators: []
    },
    {
      name: 'driverDiscount',
      disabled: false,
      validators: []
    },
  ];

  protected errorMapper = signal<{ [key: string]: string }>({
    required: '',
  });

  protected showRadioButton = computed<boolean>(() => !this.deviceDetector.isDesktop);

  ngOnInit(): void {
    this.setFormControls();
    this.getThirdPartyDiscounts();
    this.getDriverDiscounts();
  }

  ngAfterViewInit(): void {
    this.getDataFromURL();
  }

  getDriverDiscounts(): void {
    super.addSubscription(this.constantAllService.getDriverDiscounts().subscribe({
      next: res => {
        this.driverDiscounts.set(this.mapToDropdown(res));
      }
    }));
  }

  getThirdPartyDiscounts(): void {
    super.addSubscription(this.constantAllService.getThirdPartyDiscounts().subscribe({
      next: res => {
        this.thirdPartyDiscounts.set(this.mapToDropdown(res));
      }
    }));
  }

  getDataFromURL(): void {
    super.addSubscription(this.storeService.getStoreDataAsObservable()
      .subscribe({
        next: value => {
          const driverDiscount = value?.previousInsuranceDetail?.driverDiscountId;
          const thirdPartyDiscount = value?.previousInsuranceDetail?.thirdPartyDiscountId;

          if (thirdPartyDiscount) {
            this.discountForm()?.controls.thirdPartyDiscount.setValue(thirdPartyDiscount);
          }

          if (driverDiscount) {
            this.discountForm()?.controls.driverDiscount.setValue(driverDiscount);
          }
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

  private mapToDropdown(res: Array<CarDataModel>): Array<FormFieldOption> {
    return res?.map(b => ({
      title: !isNaN(+b.title) ? (b.title + ' درصد ') : b.title,
      value: b.id
    }));
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
