import { ValidatorFn, Validators } from '@angular/forms';

export const PostalCodeValidator: ValidatorFn = Validators.pattern(/^\d{10}$/);
