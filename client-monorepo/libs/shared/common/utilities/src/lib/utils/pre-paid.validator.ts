import { ValidatorFn, AbstractControl } from '@angular/forms';
import { MobileOperator } from '@client-monorepo/common/utilities';

// custom validator to check that input number is PrePaid
export function MustPrePaid(control: AbstractControl, operators: MobileOperator[]): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let isInValid = false;
    let input = control.value;
    if (input?.length > 3) {
      input = input.substr(0, 4);
      const result = operators.filter((o) => o.prefixes.some((p) => p.value === input && p.types && p.types.length > 0 && p.types.indexOf(2) >= 0));

      if (control.errors && !control.errors['mustPrePaid']) {
        // return if another validator has already found an error on the control
        return null;
      }

      // set error on control if validation fails
      if (result.length === 0) {
        isInValid = true;
      } else {
        isInValid = false;
      }
    } else {
      isInValid = false;
    }
    return isInValid ? { mustPrePaid: { value: 'Invalid' } } : null;
  };
}
