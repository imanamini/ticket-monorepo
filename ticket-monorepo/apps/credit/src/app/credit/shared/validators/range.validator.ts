import { ValidatorFn, AbstractControl } from '@angular/forms';
import { RangeNumber } from '../models/range-number.model';

// custom validator to check that input number is PrePaid
export function RangeValidator(control: AbstractControl, range: RangeNumber): ValidatorFn {



    return (control: AbstractControl): { [key: string]: any } | null => {


        let input = control.value;
        let isInValid = !(input && +input <= range.max && +input >= range.min);


        return isInValid ? { 'inInRange': { value: 'Invalid' } } : null;
    };
}
