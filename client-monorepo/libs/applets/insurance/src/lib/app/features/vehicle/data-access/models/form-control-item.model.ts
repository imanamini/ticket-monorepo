import {  ValidatorFn } from '@angular/forms';

export interface FormControlItemModel {
  name: string;
  disabled: boolean;
  validators: ValidatorFn[];
}
