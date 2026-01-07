import { Component, inject, input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { InsRadioButtonComponent } from '../../../../components/ins-radio-button/ins-radio-button.component';
import { InsRadioButtonItemModel } from '../../../../data-access/models/ins-radio-button-item.model';
import { BaseComponent } from '../../../../../../components/base/base.component';
import { FormControlItemModel } from '../../../../data-access/models/form-control-item.model';
import { StoreService } from '../../data-access/services/store.service';

@Component({
  selector: 'ownership-changed-form',
  standalone: true,
  imports: [
    InsRadioButtonComponent
  ],
  templateUrl: './ownership-changed-form.component.html',
  styleUrl: './ownership-changed-form.component.scss'
})
export class OwnershipChangedFormComponent extends BaseComponent implements OnInit {

  constructor() {
    super();
  }

  private storeService = inject(StoreService);

  ownershipChangedForm = input.required<FormGroup>();
  showError = input<boolean>(false);
  items: InsRadioButtonItemModel[] = [
    {
      title: 'بله، داشته است',
      value: 1
    },
    {
      title: 'خیر، نداشته است',
      value: 0
    }
  ];

  formControls: FormControlItemModel[] = [
    {
      name: 'ownershipChanged',
      disabled: false,
      validators: []
    }
  ];

  ngOnInit(): void {
    this.setFormControls();
    this.getDataFromStore();
  }

  getDataFromStore(): void {
    super.addSubscription(this.storeService.getStoreDataAsObservable().subscribe({
      next: value => {
        const ownerChanged = !!value?.previousInsurance?.company?.id ? value?.vehicleInfo?.ownershipChanged : null;
        if (typeof ownerChanged === 'boolean') {
          this.ownershipChangedForm()?.controls.ownershipChanged?.setValue(ownerChanged ? 1 : 0);
        }
      }
    }));
  }

  setFormControls(): void {
    this.formControls.forEach(item => {
      this.ownershipChangedForm()?.setControl(item.name, new FormControl({
        value: null,
        disabled: item.disabled
      }, [Validators.required, ...item.validators]));
    });
  }

  handleValueChange(e: number): void {
    this.ownershipChangedForm()?.controls.ownershipChanged?.setValue(e);
  }
}
