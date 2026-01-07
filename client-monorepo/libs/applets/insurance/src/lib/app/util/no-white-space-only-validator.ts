import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function NoWhitespaceOnlyValidator(): ValidatorFn {
  const regex = /^(?=.*\S).+$/;

  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (value == null || value === '') {
      return null;
    }

    const valid = regex.test(value);
    return valid ? null : {pattern: true};
  };
}
