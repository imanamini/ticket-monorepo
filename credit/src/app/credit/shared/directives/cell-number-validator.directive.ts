import {AbstractControl, ValidatorFn} from "@angular/forms";

export function cellNumberValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const isValid = /^09\d{9}$/.test(control.value);
    return !isValid ? {'mobile': {value: control.value}} : null;
  };
}
