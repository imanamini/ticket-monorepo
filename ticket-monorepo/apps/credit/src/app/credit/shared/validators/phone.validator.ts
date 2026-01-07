import { AbstractControl } from '@angular/forms';

export function ValidatePhone(control: AbstractControl) {
    const valid = /^\d+$/.test(control.value);
    return valid
      ? null
      : { invalidNumber: { valid: false, value: control.value } }
}
