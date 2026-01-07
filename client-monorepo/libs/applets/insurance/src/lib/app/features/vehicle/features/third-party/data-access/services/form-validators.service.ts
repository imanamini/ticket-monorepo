import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ConstantAllService } from '../../../../data-access/services/shared/constant-all.service';

@Injectable({
  providedIn: 'root',
})

export class FormValidatorsService {
  constructor(private constantAllService: ConstantAllService) {
  }

  claimDetailValidator(formGroup: FormGroup): boolean {

    let withoutPropertyDamage: number | null = null;
    let withoutHealthDamage: number | null = null;
    let withoutDriverDamage: number | null = null;

    this.constantAllService.getHealthDamages().subscribe({
      next: res => {
        withoutHealthDamage = res[0].id;
      }
    });

    this.constantAllService.getDriverDamages().subscribe({
      next: res => {
        withoutDriverDamage = res[0].id;
      }
    });

    this.constantAllService.getPropertyDamages().subscribe({
      next: res => {
        withoutPropertyDamage = res[0].id;
      }
    });

    return !(formGroup.value.propertyDamage === withoutPropertyDamage
      && formGroup.value.healthDamage === withoutHealthDamage
      && formGroup.value.driverDamage === withoutDriverDamage);
  }
}
