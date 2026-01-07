import { Component, inject, input, OnInit } from '@angular/core';
import { FormFieldComponent } from '@digipay/ui-form-field-builder';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormFieldOption } from '@digipay/ui-form-field-builder/lib/models/form-field-option.interface';
import { MotorStoreService } from '../../data-access/services/motor-store.service';
import { BaseComponent } from '../../../../../../components/base/base.component';

@Component({
  selector: 'motor-info-form',
  standalone: true,
  imports: [
    FormFieldComponent,
    ReactiveFormsModule
  ],
  templateUrl: './motor-info-form.component.html',
  styleUrl: './motor-info-form.component.scss'
})
export class MotorInfoFormComponent extends BaseComponent implements OnInit {

  form = input<FormGroup>();
  modelMotorcycleTypes = input.required<Array<FormFieldOption>>();
  yearList = input.required<Array<FormFieldOption>>();
  showError = input<boolean>();
  storeService = inject(MotorStoreService);

  ngOnInit(): void {
    this.prefillFields();
  }

  prefillFields(): void {
    super.addSubscription(this.storeService.getStoreDataAsObservable().subscribe({
      next: data => {
        if (data?.vehicleInfo?.typeId) {
          this.form().controls.model.setValue(data.vehicleInfo.typeId);
        }
        if (data?.vehicleInfo?.buildYear) {
          this.form().controls.buildYear.setValue(+data.vehicleInfo.buildYear);
        }
      }
    }));
  }

}
